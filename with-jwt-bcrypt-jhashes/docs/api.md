# API Documentation – Hand to Hand

## Authentication
### POST /api/auth/register
Registers a new user.

### POST /api/auth/login
Authenticates user and returns JWT.

---

## Users
### GET /api/users/me
Get logged-in user profile.

---

## Items
### POST /api/items
Create a new item listing.

### GET /api/items
Get all items (with filters).

### GET /api/items/:id
Get item details.

### PUT /api/items/:id
Update item listing.

### DELETE /api/items/:id
Delete item listing.

---

## Offers
### POST /api/offers
Create an offer for an item.

### PUT /api/offers/:id/accept
Accept an offer.

### PUT /api/offers/:id/reject
Reject an offer.

### PUT /api/offers/:id/hold
Put offer on hold.

---

## Messages
### POST /api/messages
Send a message.

### GET /api/messages/:itemId
Get chat history for item.

---

## Admin
### GET /api/admin/items
View all items.

### DELETE /api/admin/items/:id
Remove an item.

### DELETE /api/admin/users/:id
Ban a user.
