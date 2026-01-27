# Your Items (Backend – Seller CRUD)

This part of the project implements **seller-owned item management** for the Hand-to-Hand Marketplace.

It allows an **authenticated user (seller)** to create, view, update, and delete **only their own items**, enforced at the backend level using **JWT authentication** and **MongoDB**.

This README is intended for developers who want to understand **what is implemented, how it works, and how to run it locally**.


## What Is Implemented

- JWT-based authentication
- Seller-level authorization (item ownership enforced)
- Full CRUD operations on items
- MongoDB Atlas–backed storage
- Backend-only logic (frontend-agnostic)


## Item Data Model

Each item stored in MongoDB has the following structure:

```js
{
  name: String,
  imageUrl: String,
  price: Number,
  category: [String],
  details: String,
  ownerUsername: String, // derived from JWT
  createdAt: Date,
  updatedAt: Date
}

## Ownership Rule

- ownerUsername is extracted only from the JWT token
- Clients cannot spoof ownership
- All database queries are filtered by ownerUsername

## Authentication & Authorization Flow

1. User logs in via `/login`
2. Backend validates credentials
(temporary rule for assignment: password === username)
3. Backend generates a JWT token
4. Client sends token with every protected request:
5. JWT middleware:
  - Verifies token
  - Extracts username
  - Attaches it to req.user
6. All item operations are restricted to that username

## API 

All /myitems routes require JWT authentication.
| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/myitems` | Get all items owned by the logged-in seller |
| POST | `/myitems` | Create a new item |
| PUT | `/myitems/:id` | Update an existing item (seller-only) |
| DELETE | `/myitems/:id` | Delete an item (seller-only) |

## Project Setup

### Backend

```bash
cd backend
npm install
node server.js