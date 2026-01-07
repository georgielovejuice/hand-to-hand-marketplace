# Basic Chat Prototype (MERN + MongoDB Atlas)

## What this is
- Minimal chat UI (no styling) with a textbox, send button, chat log, and "other person" name
- Hard-coded users on frontend
- Backend checks credentials on EVERY read/write against MongoDB collection: user.user
- Messages stored in MongoDB collection: chats.chats

## Setup

### 1) Backend env
Copy:
- backend/.env.example -> backend/.env
Put your MongoDB Atlas connection string into MONGO_URI.

### 2) Frontend env
Copy:
- frontend/.env.example -> frontend/.env
(Usually keep VITE_API_URL=http://localhost:3001)

### 3) Install + run

#### Backend
cd backend
npm install
npm run seed
npm run dev

#### Frontend
cd ../frontend
npm install
npm run dev

Open the Vite URL (usually http://localhost:5173).
