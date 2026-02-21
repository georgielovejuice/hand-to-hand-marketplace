// IMPORTANT: Load environment variables FIRST, before any other code runs
// This must be the very first line in this module
import dotenv from "dotenv";
dotenv.config();

// Load credentials from environment variables
// DO NOT provide defaults for sensitive values - fail fast if they're missing

function getRequiredEnv(key, description) {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `MISSING ENVIRONMENT VARIABLE: ${key}\n${description}\n` +
      `Please set this in your .env file or environment variables.`
    );
  }
  return value;
}

function getOptionalEnv(key, defaultValue) {
  return process.env[key] !== undefined ? process.env[key] : defaultValue;
}

// Database
export const databaseUsername = getRequiredEnv(
  "DB_USERNAME",
  "MongoDB database username"
);
export const databasePassword = getRequiredEnv(
  "DB_PASSWORD",
  "MongoDB database password"
);

// AWS S3
export const storageRegion = getOptionalEnv("AWS_REGION", "ap-southeast-1");
export const storageKeyId = getRequiredEnv(
  "AWS_ACCESS_KEY_ID",
  "AWS S3 access key"
);
export const storageSecretAccessKey = getRequiredEnv(
  "AWS_SECRET_ACCESS_KEY",
  "AWS S3 secret access key"
);
export const storageBucketName = getOptionalEnv(
  "AWS_BUCKET_NAME",
  "auctionproject-bucket"
);

// JWT
export const jwtSecret = getRequiredEnv(
  "JWT_SECRET",
  "JWT signing secret key"
);
export const jwtExpiry = getOptionalEnv("JWT_EXPIRY", "2h");

// Bcrypt
export const bcryptSaltRounds = parseInt(
  getOptionalEnv("BCRYPT_SALT_ROUNDS", "10")
);

// Server
export const apiPort = parseInt(getOptionalEnv("PORT", "5000"));
export const nodeEnv = getOptionalEnv("NODE_ENV", "development");