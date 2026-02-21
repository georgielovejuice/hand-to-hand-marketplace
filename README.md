# Hand-to-Hand Marketplace

A production-grade second-hand marketplace with React frontend, Express.js backend, MongoDB database, AWS S3 image storage, and comprehensive admin system.

## Key Features

### User Features
- **User Authentication**: JWT-based auth with bcrypt password hashing and password validation
- **User Profiles**: Customizable profiles with avatar uploads and bio
- **Item Management**: Create, read, update, delete items with descriptions, images, and categories
- **Marketplace Browse**: Search and filter items by category, price range, keyword, seller
- **Item Detail Pages**: View full item details including seller information and ratings
- **Favorites System**: Add/remove items to favorite list for quick access
- **Messaging System**: Real-time chat between buyers and sellers with message history

### Admin Features
- **Admin Dashboard**: System-wide statistics and metrics
- **User Management**: View all users with pagination, search by role
- **User Details**: Inspect individual user profiles and activity
- **User Suspension**: Suspend/activate accounts with suspension reasons
- **Item Moderation**: Approve/reject listings with feedback
- **Item Removal**: Remove flagged or policy-violating items
- **System Statistics**: Comprehensive analytics (total users, items, chats, etc.)

### Technical Features
- **Image Storage**: Direct browser-to-S3 uploads using presigned URLs
- **Database Optimization**: Indexes on key fields (userId, category, createdAt, email)
- **Input Validation**: Server-side validation for all user inputs (auth, items, chats, etc.)
- **Error Handling**: Custom error classes with proper HTTP status codes
- **Environment Security**: Secret management via .env file, no hardcoded credentials
- **Production Ready**: Conditional logging, environment-based configuration
- **Clean Code**: MVC architecture with Services, Repositories, Controllers pattern

## Architecture

### Backend Structure (Express.js + Mongoose)

```
backend/src/
├── controllers/          # Handle HTTP requests
│   ├── AuthController.js
│   ├── ItemController.js
│   ├── ChatController.js
│   └── AdminController.js
├── services/            # Business logic layer
│   ├── AuthService.js
│   ├── ItemService.js
│   ├── ChatService.js
│   └── AdminService.js
├── repositories/        # Data access layer
│   ├── UserRepository.js
│   ├── ItemRepository.js
│   ├── ChatRepository.js
│   └── MessageRepository.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Item.js
│   ├── Chat.js
│   └── Message.js
├── routes/              # API endpoints
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   ├── chatRoutes.js
│   ├── adminRoutes.js
│   └── uploadRoutes.js
├── validators/          # Input validation
│   ├── authValidator.js
│   ├── itemValidator.js
│   ├── chatValidator.js
│   └── adminValidator.js
├── middleware/          # Express middleware
│   └── auth.js          # JWT verification, role checking
├── errors/              # Custom error classes
│   ├── AppError.js
│   └── errorHandler.js
├── utils/               # Helper functions
│   └── s3Helper.js      # S3 URL conversion
├── config/              # Configuration
│   ├── database.js      # MongoDB connection
│   ├── credentials.js   # Environment variables
│   └── constants.js     # App constants
└── app.js               # Express app setup
```

### Frontend Structure (React)

```
frontend/src/
├── pages/
│   ├── Login.jsx        # Authentication page
│   ├── Register.jsx     # User registration
│   ├── BrowsePage.js    # Marketplace listing with filters
│   ├── ItemPage.js      # Product detail view
│   ├── MyItems.js       # Seller's items dashboard
│   ├── Profile.jsx      # User profile management
│   ├── ChatPage.jsx     # Individual chat view
│   └── ChatsPage.jsx    # Chat list view
├── utils/
│   └── s3Upload.js      # S3 presigned URL upload handler
└── App.js               # Main app component
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.3, Tailwind CSS 4, DaisyUI 5 |
| **Backend** | Node.js, Express 5.2.1, Mongoose 8.0.0 |
| **Database** | MongoDB Atlas, 4 collections with indexes |
| **Authentication** | JWT tokens, bcrypt password hashing |
| **File Storage** | AWS S3 presigned URLs (client-side upload) |
| **Error Handling** | Custom error classes, proper HTTP status codes |

## Database Schema

### Collections

**Users** - Authentication and profiles
- email (unique, indexed)
- hashedPassword
- name, phone, bio
- profilePicture
- rating, reviewCount
- role (user/admin)
- isActive, suspensionReason
- Timestamps

**Items** - Marketplace listings
- title, description
- category (indexed)
- price, condition
- images (S3 keys)
- seller (indexed), sellerName
- status (active/sold/removed, indexed)
- views, favorites
- isApproved, approvedBy, rejectionReason
- expiresAt, timestamps
- Text search index on title + description

**Chats** - Conversation threads
- participants (2 users)
- itemId
- createdAt (indexed)

**Messages** - Chat messages
- chatId, sender, content
- createdAt (indexed)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AWS S3 bucket with credentials

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000

# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRY=2h

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

Start backend:
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

Start frontend:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication (POST)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Items (GET/POST)
- `GET /api/items` - Get all items
- `POST /api/items/query` - Search/filter items
- `GET /api/items/search?text=...` - Full-text search
- `GET /api/items/category/:category` - Items by category
- `GET /api/items/seller/:sellerId` - Seller's items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `POST /api/items/:id/favorite` - Add to favorites (protected)
- `DELETE /api/items/:id/favorite` - Remove from favorites (protected)

### Chat (GET/POST)
- `GET /api/chats` - Get user's chats (protected)
- `POST /api/chats` - Start new chat (protected)
- `GET /api/chats/:chatId` - Get chat details (protected)
- `GET /api/chats/:chatId/messages` - Get messages (protected)
- `POST /api/chats/:chatId/messages` - Send message (protected)

### Admin (GET/POST)
- `GET /api/admin/dashboard` - Dashboard analytics (admin)
- `GET /api/admin/statistics` - System statistics (admin)
- `GET /api/admin/users` - List all users (admin)
- `GET /api/admin/users/:userId` - User details (admin)
- `POST /api/admin/users/:userId/suspend` - Suspend user (admin)
- `POST /api/admin/users/:userId/activate` - Activate user (admin)
- `GET /api/admin/items` - List all items (admin)
- `POST /api/admin/items/:itemId/approve` - Approve item (admin)
- `POST /api/admin/items/:itemId/reject` - Reject item (admin)
- `POST /api/admin/items/:itemId/remove` - Remove item (admin)

### Upload
- `POST /api/uploads/presign` - Get S3 presigned POST URL (protected)

## Postman Collection

A comprehensive Postman collection is included: `Hand-to-Hand-Marketplace.postman_collection.json`
- Pre-configured variables (base_url, token, admin_token, etc.)
- All API endpoints with example requests
- Organized by feature (Auth, Items, Chat, Admin)

## Security Features

- JWT token-based authentication
- Bcrypt password hashing with salt rounds
- Role-based access control (admin/user)
- No hardcoded credentials (uses .env)
- Environment variable validation
- Server-side input validation
- CORS configuration
- Custom error handling with proper status codes
- Suspended users cannot login (403 Forbidden)

## Development Commands

Backend:
```bash
npm install        # Install dependencies
npm start         # Start production server
npm run dev       # Start with auto-reload (nodemon)
```

Frontend:
```bash
npm install       # Install dependencies
npm start         # Start development server
npm run build     # Build for production
```

## Testing

Test credentials available:
- **Admin**: admin@marketplace.com / admin123456
- **User**: john@example.com (from seed data)
- Register new users via authentication endpoints

## License

This project is private and for educational purposes.

## Development Notes

- Database indexes created automatically on connection
- All environment variables must be set in `.env` file
- Production mode disables verbose logging
- Suspended users get 403 Forbidden response
- S3 images served as presigned URLs with expiration
- Chat system stores full message history
- Item expiration set to 30 days