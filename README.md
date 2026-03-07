# Hand to Hand – Student Marketplace

![Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-proprietary-blue)

**Hand to Hand** is a web-based second-hand marketplace platform designed for the KMITL community. It enables students, staff, and lecturers to easily buy and sell used items through a secure, user-friendly platform with built-in messaging and offer negotiation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Project Scope](#project-scope)
- [Contributing](#contributing)

---

## Features

### User Management
- User registration with KMITL email verification
- Secure authentication using JWT + bcrypt
- User profile management
- Profile picture support

### Item Listings
- Create, edit, and delete item listings
- Upload item images to AWS S3
- Browse and search items
- Item filtering and categorization

### Messaging & Offers
- Real-time messaging between buyers and sellers
- Offer system with accept/reject/hold mechanism
- AI-powered chat assistance (OpenAI integration)
- Chat history management

### Admin Features
- User moderation and ban management
- Item removal and content moderation

---

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **HTTP Client**: Axios
- **Icons**: React Icons + FontAwesome
- **Testing**: React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3
- **AI Integration**: OpenAI API
- **Utilities**: UUID

### DevOps
- **Version Control**: Git
- **Environment Management**: .env files

---

## Project Structure

```
hand-to-hand-marketplace/
├── backend/                    # Express.js backend server
│   ├── routes/                # API route handlers
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── chat.js           # Messaging endpoints
│   │   ├── myItems.js        # User items endpoints
│   │   └── profile.js        # User profile endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── api_methods.js        # Core API logic
│   ├── database.js           # MongoDB connection
│   ├── openAI.js             # OpenAI client setup
│   ├── s3Interface.js        # AWS S3 integration
│   ├── server.js             # Express app initialization
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Searchbar.jsx
│   │   │   ├── CreateItemWindow.jsx
│   │   │   ├── ProfileComponents.jsx
│   │   │   └── Container.jsx
│   │   ├── layouts/
│   │   │   └── authLayout.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── BrowsePage.js
│   │   │   ├── ItemPage.js
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ChatsPage.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── MyItems.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.js
│
└── docs/                       # Project documentation
    ├── api.md                 # API endpoint reference
    ├── architecture.md        # System architecture details
    ├── scope.md              # Project scope & requirements
    └── chatTestRoutine.md    # Chat testing guidelines
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Git**

AWS S3 and OpenAI API keys are required for full functionality.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hand-to-hand-marketplace.git
   cd hand-to-hand-marketplace
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

Create `.env` files in both `backend/` and `frontend/` directories.

#### Backend `.env`
```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name

# OpenAI
OPENAI_API_KEY=your_openai_key
```

#### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

---

## Running the Project

### Development Mode

**Terminal 1 – Backend Server**
```bash
cd backend
npm start
```
The backend server will run on `http://localhost:5000`

**Terminal 2 – Frontend Development Server**
```bash
cd frontend
npm start
```
The frontend will open at `http://localhost:3000`

### Production Build

**Build frontend**
```bash
cd frontend
npm run build
```

**Start backend in production**
```bash
cd backend
NODE_ENV=production npm start
```

---

## API Documentation

For detailed API endpoint documentation, refer to [docs/api.md](docs/api.md).

### Key Endpoints

**Authentication**
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login

**Items**
- `GET /api/myItems` – User's listings
- `POST /api/myItems` – Create new item
- `PUT /api/myItems/:id` – Update item
- `DELETE /api/myItems/:id` – Delete item

**Chat**
- `GET /api/chat` – Get chat history
- `POST /api/chat` – Send message
- `GET /api/chat/metadata` – Get chat metadata

**Profile**
- `GET /api/profile` – Get user profile
- `PUT /api/profile` – Update user profile

**Upload**
- `POST /api/upload` – Upload images to S3

---

## Project Scope

### In Scope
- User authentication and profile management
- Item listing management (CRUD operations)
- Messaging between buyers and sellers
- Offer accept/reject/hold mechanism
- Admin moderation tools

### Out of Scope
- Online payment systems
- Delivery or logistics services
- External marketplace integrations
- Rating or review systems

For more details, see [docs/scope.md](docs/scope.md).

---

## Security

- Passwords are hashed using **bcrypt** (10 salt rounds)
- Authentication tokens use **JWT** with configurable expiration
- All API requests require HTTPS in production
- Sensitive data is stored in environment variables
- Email verification enforces KMITL domain usage
- CORS is configured to prevent unauthorized cross-origin requests

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -m 'Add feature: description'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Open a Pull Request

Before submitting a PR:
- Test your changes thoroughly
- Follow existing code style
- Update documentation as needed

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running or your Atlas connection string is correct
- Check `MONGODB_URI` in `.env`

### S3 Upload Failures
- Verify AWS credentials in `.env`
- Ensure S3 bucket exists and permissions are set correctly

### JWT Authentication Errors
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration (`JWT_EXPIRES_IN`)

---

## License

This project is proprietary and intended for KMITL use only.

---

## Contact & Support

For questions or issues, please reach out to the development team or check the documentation in the `docs/` folder.