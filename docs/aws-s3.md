# AWS S3 Image Storage

This project uses S3 presigned POST uploads for item images and profile pictures.

## 1) Create a Bucket
- Create an S3 bucket in your AWS account.
- Disable public access if you plan to serve images via the backend `/resource` route.
- Enable CORS for browser uploads (example below).

### Bucket CORS example
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["POST"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

## 2) Environment Variables
Set these in your backend environment (or add to your runtime config):

```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=YOUR_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET
AWS_S3_BUCKET=YOUR_BUCKET_NAME
PUBLIC_RESOURCE_BASE_URL=http://localhost:5001
```

- `PUBLIC_RESOURCE_BASE_URL` is used to generate URLs like `http://localhost:5001/resource/<key>`.
- In production, set it to your API domain or a CDN domain.

## 3) Upload Flow
1. Frontend requests `/api/uploads/presign` with file metadata.
2. Backend returns a presigned POST payload.
3. Frontend uploads directly to S3 using the returned fields.
4. Backend stores the resulting `resourceUrl` string in MongoDB.

## 4) Optional Migration Script
If old images are stored as base64 data URIs in MongoDB, run:

```bash
node backend/scripts/migrate_images_to_s3.js
```

This script updates `User.profilePicture` and `Item.imageURL` fields to S3 URLs.
