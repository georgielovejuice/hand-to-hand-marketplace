# Hand-to-Hand Marketplace

A production-grade second-hand marketplace with React frontend, Express backend, MongoDB database, and AWS S3 image storage.

## Features

- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Item Management**: Create, read, update, delete items with descriptions and images
- **Image Storage**: Direct browser-to-S3 uploads using presigned URLs, private bucket
- **Marketplace**: Browse items with pagination and category filtering
- **User Profiles**: Customizable profiles with avatar uploads
- **Messaging**: Real-time chat between buyers and sellers
- **Input Validation**: Server-side validation for all user inputs
- **Database Optimization**: Indexes on userId, category, createdAt for fast queries

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Express.js, MongoDB, JWT, bcrypt |
| Storage | AWS S3 (presigned URLs) |
| Auth | JWT tokens, bcrypt hashing |

## Quick Start

### Backend Setup

```bash
cd backend
npm install
```

Create `backendCredentials.js`:
```javascript
module.exports = {
  mongoURL: "mongodb://localhost:27017/marketplace",
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "your_key",
  AWS_SECRET_ACCESS_KEY: "your_secret",
  AWS_S3_BUCKET: "your-bucket",
  JWT_SECRET: "your-secret",
  JWT_EXPIRES_IN: "1h"
};
```

Setup database indexes and start:
```bash
node scripts/setup-indexes.js
npm start
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

Start:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
backend/
├── routes/
│   ├── auth.js              # Register/login
│   ├── myItems.js           # Item CRUD (validation, pagination)
│   ├── profile.js           # User profile endpoint
│   ├── chat.js              # Messaging
│   ├── uploads.js           # Presigned URL generation
│   └── resource.js          # S3 image serving
├── middleware/
│   └── auth.js              # JWT verification
├── scripts/
│   └── setup-indexes.js     # Create DB indexes
├── api_methods.js           # Database operations
├── database.js              # MongoDB connection
├── s3Client.js              # AWS S3 config
└── server.js                # Express setup

frontend/
├── src/pages/
│   ├── BrowsePage.js        # Marketplace listing
│   ├── ItemPage.js          # Product detail
│   ├── MyItems.js           # Seller dashboard
│   ├── Profile.jsx          # User profile
│   ├── ChatPage.jsx         # Messaging
│   ├── Login.jsx
│   └── Register.jsx
├── src/utils/
│   └── s3Upload.js          # Upload utility
├── App.js
└── index.js
```

## Key Implementation Details

### Image Upload Flow

1. User selects image in React component
2. Component requests presigned URL from `/api/uploads/presigned-url`
3. Frontend receives form data and upload URL
4. Browser uploads directly to S3 (no backend processing)
5. S3 returns object key (e.g., `items/userId/uuid.jpg`)
6. Frontend stores S3 key in item data, backend saves to MongoDB

See: [s3Upload.js](frontend/src/utils/s3Upload.js), [uploads.js](backend/routes/uploads.js)

### Image Display

Frontend uses `buildImageUrl()` helper to construct: `/api/resource/items/userId/uuid.jpg`

Backend `/api/resource/:key` serves images from S3

See: [resource.js](backend/routes/resource.js), [BrowsePage.js](frontend/src/pages/BrowsePage.js)

### Item Management with Validation

All items validated on backend before saving:
- Title, description, price input validation
- Category constraints
- Proper HTTP status codes (200, 400, 404, 500)

See: [myItems.js](backend/routes/myItems.js), [api_methods.js](backend/api_methods.js)

### Database Indexes

Created automatically via `scripts/setup-indexes.js`:
- Users: email (unique)
- Items: userId, category, createdAt
- Messages: senderId/recipientId, createdAt

### Pagination

Items endpoint `/api/items?page=1` returns 20 items per page with:
- items array
- currentPage
- totalPages
- totalItems

See: [api_methods.js](backend/api_methods.js#L20)

## API Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token

### Items
- `GET /api/items?page=1&category=...` - List items (paginated)
- `POST /api/items` - Create item (auth required)
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item (auth required)
- `DELETE /api/items/:id` - Delete item (auth required)

### Uploads & Storage
- `POST /api/uploads/presigned-url` - Get S3 upload URL (auth required)
- `GET /api/resource/:key` - Serve image from S3

### Profile
- `GET /api/profile/:userId` - Get user info
- `PUT /api/profile` - Update profile (auth required)

### Chat
- `GET /api/chats` - Get conversations (auth required)
- `POST /api/chats/send` - Send message (auth required)

## Database Schema

**Users**: email, passwordHash, firstName, lastName, profileImageKey

**Items**: userId, title, description, price, category, imageKeys[], createdAt

**Messages**: senderId, recipientId, message, read, createdAt

## Security

- Raw passwords sent over HTTPS only
- Passwords hashed with bcrypt on backend
- JWT tokens include expiration
- S3 bucket is private (presigned URLs only)
- All inputs validated server-side
- Generic error messages prevent info leakage

## Deployment

### Environment Variables
Set in production:
- `NODE_ENV=production`
- `JWT_SECRET` - Strong random value
- `mongoURL` - MongoDB Atlas or managed service
- AWS credentials with S3 permissions only

### Backend
```bash
npm install --production
npm start
```

### Frontend
```bash
npm run build
# Deploy dist/ to static hosting (Vercel, Netlify, etc.)
```

## Troubleshooting

**Images not showing?**
- Check `/api/resource/items/userId/uuid.jpg` directly
- Verify S3 keys in DB don't have leading slashes
- Confirm buildImageUrl() helper constructs correct paths

**Upload fails?**
- Check AWS credentials in backendCredentials.js
- Verify presigned URL endpoint returns valid response
- Check browser console for CORS errors

**Auth issues?**
- Verify JWT_SECRET is set
- Check Authorization header includes token
- Request new token if expired

**DB not connecting?**
- Verify mongoURL in backendCredentials.js
- Confirm MongoDB is running
- Run `node scripts/setup-indexes.js` for indexes

## License

Educational and commercial use.