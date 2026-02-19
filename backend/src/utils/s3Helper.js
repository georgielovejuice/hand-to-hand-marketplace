/**
 * S3 URL Helper - Construct S3 URLs from keys
 * Stores only keys in DB, constructs URLs dynamically
 * Production-grade approach used by Facebook, Amazon, Etsy
 */

import { storageBucketName, storageRegion } from "../config/credentials.js";

/**
 * Get full S3 URL from S3 key
 * @param {string} s3Key - S3 object key (e.g., "items/userId/uuid.jpg")
 * @returns {string} Full S3 URL
 */
export function getS3Url(s3Key) {
  if (!s3Key) return null;
  
  // Format: https://bucket-name.s3.region.amazonaws.com/key
  return `https://${storageBucketName}.s3.${storageRegion}.amazonaws.com/${s3Key}`;
}

/**
 * Extract S3 key from URL
 * @param {string} url - Full S3 URL
 * @returns {string} S3 key
 */
export function extractS3Key(url) {
  if (!url) return null;
  
  // Extract key from URL: remove base URL, keep only the key part
  const baseUrl = `https://${storageBucketName}.s3.${storageRegion}.amazonaws.com/`;
  return url.replace(baseUrl, "");
}

/**
 * Check if string is an S3 key (not a full URL)
 */
export function isS3Key(value) {
  if (!value) return false;
  return !value.startsWith("http");
}

/**
 * Normalize storage value - if it's a URL, extract key; if it's a key, return as is
 */
export function normalizeStorageValue(value) {
  if (!value) return null;
  
  if (value.startsWith("http")) {
    return extractS3Key(value);
  }
  
  return value;
}
