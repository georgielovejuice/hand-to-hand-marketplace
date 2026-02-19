import { S3Client } from "@aws-sdk/client-s3";
import {
  storageRegion,
  storageKeyId,
  storageSecretAccessKey,
  storageBucketName
} from "./backendCredentials.js";

const region = process.env.AWS_REGION || storageRegion;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || storageKeyId;
const secretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY || storageSecretAccessKey;

export const s3BucketName = process.env.AWS_S3_BUCKET || storageBucketName;
export const s3Region = region;

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});
