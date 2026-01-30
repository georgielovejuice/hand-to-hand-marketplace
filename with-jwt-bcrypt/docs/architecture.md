# System Architecture – Hand to Hand

## Architecture Overview
The system follows a client–server architecture with a RESTful API and real-time messaging.

## Technology Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT
- Messaging: NOT SURE MAN (IT COULD BE SOCKET.IO)

## High-Level Architecture
Client (Browser)
→ REST API / WebSocket
→ Backend Server
→ Database & File Storage

## Frontend Layer
- Handles UI rendering
- Sends HTTP requests to backend
- Displays item listings, chat, and offers

## Backend Layer
- Authentication and authorization
- Item and offer management
- Messaging logic
- Admin moderation

## Data Layer
- Users
- Items
- Categories
- Offers
- Messages

## Security Considerations
- Password hashing
- Environment variables for secrets
- Role-based access control
