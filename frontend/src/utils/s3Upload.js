export async function uploadImageToS3({ token, apiUrl, purpose, file }) {
  if (!file) {
    throw new Error("No file provided");
  }

  const presignResponse = await fetch(`${apiUrl}/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      purpose,
      contentType: file.type,
      fileName: file.name
    })
  });

  const presignBody = await presignResponse.json();
  if (!presignResponse.ok) {
    console.error("❌ Presign failed:", presignBody);
    throw new Error(presignBody.message || "Failed to create upload URL");
  }

  console.log("✅ Presigned URL received:", {
    s3Url: presignBody.url,
    key: presignBody.key,
    fieldCount: Object.keys(presignBody.fields).length
  });

  const formData = new FormData();
  
  for (const [key, value] of Object.entries(presignBody.fields)) {
    console.log(`  Field: ${key}`);
    formData.append(key, value);
  }

  formData.append("file", file);

  console.log("📤 Uploading to S3...");

  const uploadResponse = await fetch(presignBody.url, {
    method: "POST",
    body: formData
  });

  console.log("S3 Response Status:", uploadResponse.status);

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error("❌ S3 Error:", errorText);
    throw new Error("Image upload failed: " + uploadResponse.status);
  }

  return presignBody.key;
}
