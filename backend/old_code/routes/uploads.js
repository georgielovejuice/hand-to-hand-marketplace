import express from "express";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../middleware/auth.js";
import { s3Client, s3BucketName } from "../s3Client.js";

const router = express.Router();
router.use(verifyToken);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);
const EXTENSION_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

router.post("/presign", async (req, res) => {
  try {
    const { purpose, contentType, fileName } = req.body;
    if (!contentType || !ALLOWED_MIME_TYPES.has(contentType)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const extension = EXTENSION_BY_TYPE[contentType];
    if (!extension) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const prefix = purpose === "profile" ? "profiles" : "items";
    const key = `${prefix}/${req.user.userId}/${uuidv4()}.${extension}`;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: s3BucketName,
      Key: key,
      Conditions: [
        ["content-length-range", 1, MAX_FILE_SIZE_BYTES],
        ["eq", "$Content-Type", contentType]
      ],
      Fields: {
        "Content-Type": contentType
      },
      Expires: 60
    });

    res.json({ url, fields, key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create upload URL" });
  }
});

export default router;
