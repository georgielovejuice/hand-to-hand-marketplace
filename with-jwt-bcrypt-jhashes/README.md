# Authentication System (JWT + bcrypt)

This project implements a JWT-based authentication system with secure password handling.
The backend supports two authentication approaches to stay compatible with different frontend implementations.

The goal is to keep authentication logic clear, maintainable, and aligned with common backend practices.

---

## Authentication Design Overview

Authentication responsibilities are split as follows:

- **Password security** is handled using `bcrypt`
- **User authentication and session management** is handled using JSON Web Tokens (JWT)

Password hashing is only used during registration and login.
JWT is used after login to authenticate and authorize API requests.

These two concerns are intentionally kept separate.

---

## Why JWT Is Used

JWT is used because the application follows a frontend–backend separation and exposes a REST API.

JWT allows:
- Stateless authentication
- Protected routes
- Role-based access control
- No server-side session storage

JWT is not related to how passwords are hashed and should remain unchanged regardless of the password hashing strategy.

---

## Supported Authentication Modes

### Mode 1: JWT + bcrypt (Recommended)

This is the standard and recommended implementation.

#### Flow
1. Frontend sends the raw password over HTTPS
2. Backend hashes the password using bcrypt during registration
3. Backend verifies the password using bcrypt during login
4. Backend issues a JWT on successful authentication
5. Frontend includes the JWT in subsequent API requests

#### Notes
- Password hashing is fully controlled by the backend
- This approach is secure, maintainable, and widely used
- This should be the default mode going forward

---

### Mode 2: JWT + frontend jhash + backend bcrypt (Compatibility Mode)

This mode exists to support a frontend that hashes passwords before sending them to the backend.

#### Flow
1. Frontend hashes the password using `jhash`
2. Frontend sends the hashed value to the backend
3. Backend hashes the jhash output using bcrypt during registration
4. Backend compares bcrypt(jhash(password)) during login
5. Backend issues a JWT on successful authentication

#### Notes
- The backend never receives the raw password
- bcrypt treats the jhash output as the password
- Any change to the frontend hashing algorithm will invalidate stored passwords
- This approach is not recommended for production use

This mode should be considered temporary and used only for compatibility during development.

---

## Security Considerations

- bcrypt cannot directly compare hashes produced by another algorithm
- Hashing a value multiple times with different algorithms does not improve security
- HTTPS already protects passwords in transit
- Password hashing should ideally be handled only by the backend

Long-term recommendation: remove frontend hashing and rely exclusively on backend bcrypt.

---

## Environment Variables

```env
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h