import express from "express";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../middleware/auth.js";
import {
  storageKeyId,
  storageSecretAccessKey,
  storageRegion,
  storageBucketName,
} from "../config/credentials.js";
import { asyncHandler } from "../errors/errorHandler.js";
import { ValidationError } from "../errors/AppError.js";

const router = express.Router();

// Initialize S3 Client
const s3Client = new S3Client({
  region: storageRegion,
  credentials: {
    accessKeyId: storageKeyId,
    secretAccessKey: storageSecretAccessKey,
  },
});

// File upload configuration
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const EXTENSION_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Protect all upload routes with token verification
router.use(verifyToken);

/**
 * Generate presigned POST URL for S3 upload
 * POST /api/uploads/presign
 */
router.post(
  "/presign",
  asyncHandler(async (req, res) => {
    const { purpose, contentType, fileName } = req.body;

    // Validate content type
    if (!contentType || !ALLOWED_MIME_TYPES.has(contentType)) {
      throw new ValidationError("Unsupported file type");
    }

    if (!purpose || !["profile", "item"].includes(purpose)) {
      throw new ValidationError("Invalid purpose. Must be 'profile' or 'item'");
    }

    // Get file extension
    const extension = EXTENSION_BY_TYPE[contentType];
    if (!extension) {
      throw new ValidationError("Unsupported file type");
    }

    // Generate unique key
    const prefix = purpose === "profile" ? "profiles" : "items";
    const key = `${prefix}/${req.user.userId}/${uuidv4()}.${extension}`;

    try {
      // Create presigned POST
      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: storageBucketName,
        Key: key,
        Conditions: [
          ["content-length-range", 1, MAX_FILE_SIZE_BYTES],
          ["eq", "$Content-Type", contentType],
        ],
        Fields: {
          "Content-Type": contentType,
        },
        Expires: 3600, // 1 hour
      });

      res.json({
        url,
        fields,
        key,
        message: "Presigned URL generated successfully",
      });
    } catch (error) {
      console.error("S3 Presign Error:", error);
      throw new Error("Failed to generate upload URL");
    }
  })
);

export default router;
