import { PutObjectCommand } from "@aws-sdk/client-s3";
import mongoClient from "../database.js";
import { s3Client, s3BucketName } from "../s3Client.js";

const DEFAULT_BASE_URL = "http://localhost:5001";
const PUBLIC_RESOURCE_BASE_URL =
  process.env.PUBLIC_RESOURCE_BASE_URL || DEFAULT_BASE_URL;

const EXTENSION_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

function parseDataUri(dataUri) {
  if (typeof dataUri !== "string" || !dataUri.startsWith("data:")) {
    return null;
  }

  const [metadata, base64Data] = dataUri.split(",");
  if (!metadata || !base64Data) {
    return null;
  }

  const contentTypeMatch = metadata.match(/data:([^;]+);base64/);
  if (!contentTypeMatch) {
    return null;
  }

  return {
    contentType: contentTypeMatch[1],
    buffer: Buffer.from(base64Data, "base64")
  };
}

function buildResourceUrl(key) {
  return `${PUBLIC_RESOURCE_BASE_URL}/resource/${key}`;
}

async function uploadBuffer({ key, buffer, contentType }) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3BucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType
    })
  );
  return buildResourceUrl(key);
}

async function migrateCollection({
  collection,
  fieldName,
  keyPrefix,
  idField
}) {
  const cursor = collection.find({ [fieldName]: { $type: "string" } });
  let migratedCount = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const value = doc[fieldName];
    const parsed = parseDataUri(value);

    if (!parsed) {
      continue;
    }

    const extension = EXTENSION_BY_TYPE[parsed.contentType];
    if (!extension) {
      continue;
    }

    const key = `${keyPrefix}/${doc[idField]}.${extension}`;
    const resourceUrl = await uploadBuffer({
      key,
      buffer: parsed.buffer,
      contentType: parsed.contentType
    });

    await collection.updateOne(
      { _id: doc._id },
      { $set: { [fieldName]: resourceUrl } }
    );

    migratedCount += 1;
    console.log(`Migrated ${collection.collectionName} ${doc._id}`);
  }

  return migratedCount;
}

async function main() {
  await mongoClient.connect();

  const userCollection = mongoClient.db("User").collection("User");
  const itemCollection = mongoClient.db("Item").collection("Item");

  const migratedUsers = await migrateCollection({
    collection: userCollection,
    fieldName: "profilePicture",
    keyPrefix: "profiles",
    idField: "_id"
  });

  const migratedItems = await migrateCollection({
    collection: itemCollection,
    fieldName: "imageURL",
    keyPrefix: "items",
    idField: "_id"
  });

  console.log(`Migrated ${migratedUsers} user images`);
  console.log(`Migrated ${migratedItems} item images`);

  await mongoClient.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
