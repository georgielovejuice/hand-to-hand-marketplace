import express from "express";
import {
  GetObjectCommand,
  InvalidObjectState,
  NoSuchKey,
  S3ServiceException
} from "@aws-sdk/client-s3";
import { s3Client, s3BucketName } from "../s3Client.js";

const router = express.Router();

/**
 * GET /resource/:key
 * Serve images from private S3 bucket
 * 
 * Throws:
 * - InvalidObjectState - object is archived and inaccessible (403)
 * - NoSuchKey - No file corresponding to the requested name (400)
 * - S3ServiceException - anything else (500)
 */
router.get(/^(.+)$/, async (request, response) => {
  try {
    let key = request.params[0];
    if (key.startsWith('/')) key = key.slice(1);
    
    const storageResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: s3BucketName, Key: key })
    );
    
    if (storageResponse.ContentType) {
      response.setHeader("Content-Type", storageResponse.ContentType);
    }
    
    response.send(await storageResponse.Body.transformToByteArray());
  } catch (error) {
    const badRequestErrorCode = 400;
    const contentForbiddenErrorCode = 403;
    const internalServerErrorCode = 500;
    
    if (error instanceof InvalidObjectState) {
      response.sendStatus(contentForbiddenErrorCode);
    } else if (error instanceof NoSuchKey) {
      response.sendStatus(badRequestErrorCode);
    } else {
      console.error('Resource error:', error);
      response.sendStatus(internalServerErrorCode);
    }
  }
});

export default router;
