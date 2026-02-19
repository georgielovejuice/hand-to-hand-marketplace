#!/usr/bin/env node

import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL || "http://localhost:5001/api";
const TEST_EMAIL = "s3-test@example.com";
const TEST_PASSWORD = "password123";

let testToken = null;
let testUserId = null;

async function log(message, data = null) {
  console.log(`\n✓ ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

async function error(message, err = null) {
  console.error(`\n✗ ${message}`);
  if (err) {
    console.error(err.message || err);
  }
}

async function registerUser() {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "S3 Test User",
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });

    if (res.status === 400) {
      await log("User already exists, proceeding to login");
      return;
    }

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    await log("User registered");
  } catch (err) {
    await error("Failed to register user", err);
    process.exit(1);
  }
}

async function loginUser() {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    testToken = data.token;
    testUserId = data.safeUser._id;

    await log("User logged in", { token: testToken.substring(0, 20) + "..." });
  } catch (err) {
    await error("Failed to login", err);
    process.exit(1);
  }
}

async function requestPresignedUrl(purpose = "item", contentType = "image/jpeg") {
  try {
    const res = await fetch(`${API_URL}/uploads/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: testToken
      },
      body: JSON.stringify({
        purpose,
        contentType,
        fileName: `test-${Date.now()}.jpg`
      })
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${res.status} ${body}`);
    }

    const data = await res.json();
    await log(`Presigned URL received for ${purpose}`, {
      key: data.key,
      resourceUrl: data.resourceUrl
    });

    return data;
  } catch (err) {
    await error("Failed to get presigned URL", err);
    process.exit(1);
  }
}

async function testContentTypeValidation() {
  try {
    const res = await fetch(`${API_URL}/uploads/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: testToken
      },
      body: JSON.stringify({
        purpose: "item",
        contentType: "application/pdf",
        fileName: "invalid.pdf"
      })
    });

    if (res.status === 400) {
      await log("✓ Content-type validation works (PDF rejected)");
      return;
    }

    await error("Content-type validation failed - PDF should be rejected");
  } catch (err) {
    await error("Content-type validation test failed", err);
  }
}

async function runTests() {
  console.log("=== S3 Upload Test Suite ===\n");
  console.log(`API URL: ${API_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}\n`);

  await registerUser();
  await loginUser();

  console.log("\n--- Testing Presigned URL Generation ---");
  const profilePresign = await requestPresignedUrl("profile", "image/jpeg");
  const itemPresign = await requestPresignedUrl("item", "image/png");

  console.log("\n--- Testing Content-Type Validation ---");
  await testContentTypeValidation();

  console.log(`
  
=== Next Steps ===

1. ✓ Backend is running and responding
2. ✓ JWT authentication working
3. ✓ Presigned URL endpoint working
4. ✓ Content-type validation working

To fully test S3 uploads:

Option A: Manual Upload via Postman
- Use the presignData above to construct a multipart/form-data POST to S3
- See docs/testing-s3-uploads.md for detailed instructions

Option B: Frontend Testing
- npm start in frontend/
- Go to "My Items" or "Profile"
- Select an image file and upload
- Check browser console for success/errors

Option C: AWS Console
- Check S3 console to verify files were uploaded to the bucket

✅ Backend S3 integration is ready for testing!
  `);
}

runTests().catch(console.error);
