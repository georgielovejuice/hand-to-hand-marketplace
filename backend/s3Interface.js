import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {S3Client, GetObjectCommand, InvalidObjectState, NoSuchKey, S3ServiceException} from '@aws-sdk/client-s3';
import {storageRegion, storageKeyId, storageSecretAccessKey, storageBucketName} from './backendCredentials.js';
import { v4 as uuidv4 } from "uuid";

import {verifyToken} from './middleware/auth.js';

import express from 'express';
const router = express.Router();

const s3Client = new S3Client({
	region: storageRegion,
	credentials:{
		accessKeyId: storageKeyId,
		secretAccessKey: storageSecretAccessKey
	}
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

export async function postPresignedKey(purpose, contentType, fileName, userID){
  // Validate content type
  if (!contentType || !ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error("Unsupported file type");
  }

  if (!purpose || !["profile", "item"].includes(purpose)) {
    throw new Error("Invalid purpose. Must be 'profile' or 'item'");
  }

  // Get file extension
  const extension = EXTENSION_BY_TYPE[contentType];
  if (!extension) {
    throw new Error("Unsupported file type");
  }

  // Generate unique key
  const prefix = purpose === "profile" ? "profiles" : "items";
  const key = `${prefix}/${userID}/${uuidv4()}.${extension}`;

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

    return({
      url,
      fields,
      key,
      message: "Presigned URL generated successfully",
    });
  } catch (error) {
    console.error("S3 Presign Error:", error);
    throw new Error("Failed to generate upload URL");
  }
}

router.post("/presign", verifyToken, async (request, response) => {
  const HTTP_STATUS_FOR_BAD_REQUEST = 400;
  
  const userId = request.user.userId;
  const {purpose, contentType, filename} = request.body;
  
  let presignedKeyReturn;
  try{
    presignedKeyReturn = await postPresignedKey(purpose, contentType, filename, userId);
  }catch(err){
    return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: err});
  }
  
  response.json({
    uploadingURL: presignedKeyReturn.url,
    fields: presignedKeyReturn.fields,
  });
});

export default router;