# Your Items (Backend – Seller CRUD)

This part of the project handles **seller-owned item management**.
It allows an authenticated user to create, view, update, and delete **only their own items** using JWT authentication.

This README is for developers who want to understand **what is implemented and how to run it**.

---

## What This Does

- JWT-based authentication
- Seller can only access **their own items**
- Full CRUD operations on items
- MongoDB-backed storage

---

## Item Structure

Each item stored in MongoDB contains:

- `name` (string)
- `imageUrl` (string)
- `price` (number)
- `category` (array of strings)
- `details` (string)
- `ownerUsername` (string, from JWT)
- `createdAt`
- `updatedAt` (on edit)

---

## Authentication Flow

1. User logs in via `/login`
2. Backend returns a JWT token
3. Token is sent in every request:
- Authorization: Bearer <token>
4. Backend verifies token
5. Username is extracted from token
6. All item operations are restricted to that username

## API Endpoints

### Login
| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/myitems` | Get logged-in user’s items |
| POST | `/myitems` | Create a new item |
| PUT | `/myitems/:id` | Update an item |
| DELETE | `/myitems/:id` | Delete an item |

## Project Setup

### Backend

```bash
cd backend
npm install
node server.js