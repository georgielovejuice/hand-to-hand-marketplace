# Testing S3 Image Upload Flow

Follow these steps to test the S3 presigned POST upload system end-to-end.

## 1. Start the Backend

```bash
cd backend
npm install  # if not already done
node server.js
```

Check that it's running:
```
curl http://localhost:5001/
# Should return: "Server for AuctionDraft is up and running :D"
```

## 2. Test Get Presigned Upload URL

### Register/Login to get JWT token

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login to get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the login response.

### Request Presigned Upload URL

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5001/api/uploads/presign \
  -H "Content-Type: application/json" \
  -H "authorization: $TOKEN" \
  -d '{
    "purpose": "profile",
    "contentType": "image/jpeg",
    "fileName": "test.jpg"
  }'
```

Response example:
```json
{
  "url": "https://auctionproject-bucket.s3.ap-southeast-1.amazonaws.com/",
  "fields": {
    "acl": "private",
    "bucket": "auctionproject-bucket",
    "Content-Type": "image/jpeg",
    "key": "profiles/user-id/uuid.jpg",
    "policy": "...",
    "x-amz-credential": "...",
    "x-amz-date": "...",
    "x-amz-signature": "..."
  },
  "key": "profiles/user-id/uuid.jpg",
  "resourceUrl": "http://localhost:5001/resource/profiles/user-id/uuid.jpg"
}
```

## 3. Upload Image File to S3

### Using curl

```bash
TOKEN="your_jwt_token_here"

# First, get presigned URL
PRESIGN=$(curl -s -X POST http://localhost:5001/api/uploads/presign \
  -H "Content-Type: application/json" \
  -H "authorization: $TOKEN" \
  -d '{
    "purpose": "item",
    "contentType": "image/jpeg",
    "fileName": "product.jpg"
  }')

# Extract URL and fields (or do this manually)
# Then upload the file
curl -X POST "$(echo $PRESIGN | jq -r '.url')" \
  -F "acl=$(echo $PRESIGN | jq -r '.fields.acl')" \
  -F "bucket=$(echo $PRESIGN | jq -r '.fields.bucket')" \
  -F "Content-Type=$(echo $PRESIGN | jq -r '.fields.Content-Type')" \
  -F "key=$(echo $PRESIGN | jq -r '.fields.key')" \
  -F "policy=$(echo $PRESIGN | jq -r '.fields.policy')" \
  -F "x-amz-credential=$(echo $PRESIGN | jq -r '.fields.x-amz-credential')" \
  -F "x-amz-date=$(echo $PRESIGN | jq -r '.fields.x-amz-date')" \
  -F "x-amz-signature=$(echo $PRESIGN | jq -r '.fields.x-amz-signature')" \
  -F "file=@./test-image.jpg"
```

### Using Postman (Easier)

1. **Get Presigned URL** (requests shown in step 2)
2. **Copy the response fields** from the `fields` object
3. **Create new Postman request**:
   - Method: POST
   - URL: `https://auctionproject-bucket.s3.ap-southeast-1.amazonaws.com/`
   - Body → form-data:
     - Add each field from response → paste values
     - Add field `file` → select your image file
   - Send
4. **Expected**: 204 status code (success)

## 4. Test Image Retrieval

After upload succeeds, retrieve the image:

```bash
TOKEN="your_jwt_token_here"

# Using the resourceUrl from presign response
curl http://localhost:5001/resource/items/user-id/uuid.jpg \
  -H "authorization: $TOKEN" \
  --output retrieved-image.jpg
```

Check if the file appears correctly.

## 5. Frontend Testing (Manual)

1. **Start frontend**:
   ```bash
   cd frontend
   npm start
   ```

2. **Navigate to "My Items"**:
   - Fill in item name, price, categories, details
   - **Click "Choose File"** and select a JPEG/PNG
   - Image preview should appear below the input
   - Click **"Add Item"** → should upload to S3
   - Check browser console for errors

3. **Verify in Profile**:
   - Navigate to "Your Page" (Profile)
   - Click "Edit Profile"
   - **Click "Choose File"** for profile picture
   - Should preview and upload

4. **Check MongoDB** (optional – verify S3 URLs stored):
   ```bash
   # Via MongoDB Atlas UI or Compass
   # User collection: profilePicture field
   # Item collection: imageURL field
   # Should show: http://localhost:5001/resource/...
   ```

## 6. Troubleshooting

### 401 Unauthorized on presign
- Token expired or missing → re-login
- Check `authorization` header is set correctly

### 400 Bad contentType
- Only JPEG, PNG, WebP, GIF allowed
- Check file MIME type matches

### S3 Upload fails (presign worked)
- Check bucket CORS settings (step 1 in [docs/aws-s3.md](../docs/aws-s3.md))
- Ensure credentials in `backendCredentials.js` are correct
- Check bucket exists and is accessible

### 503 getting image back
- Bucket may need time to sync keys after upload
- Check key in S3 console matches resourceUrl
- Verify bucket is not set to private with restricted access

### Image not showing in frontend
- Check browser Network tab for 404 on image request
- Ensure `PRIMARY_RESOURCE_BASE_URL` matches your backend URL in env
- MongoDB might still have old `data:` URIs → run migration script
