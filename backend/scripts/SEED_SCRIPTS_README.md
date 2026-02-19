# Seed Scripts Guide

This directory contains scripts to populate your MongoDB database with sample data for testing and development.

## Available Scripts

### 1. `seed-admin.js` - Create Admin User
Creates a single admin account.

```bash
node scripts/seed-admin.js
```

**Creates:**
- 1 admin user with full system access

**Credentials:**
- Email: `admin@marketplace.com`
- Password: `admin123456`

---

### 2. `seed-database.js` - Complete Database Seeding
Creates a complete set of sample data across all collections.

```bash
node scripts/seed-database.js
```

**Creates:**
- 5 users (1 admin, 4 regular users)
- 6 items (various categories and statuses)
- 3 chats (conversations between users)
- 7 messages (chat messages across conversations)

**Collections Populated:**

#### Users Collection (5 documents)
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "hashedPassword": "bcrypt_hash_...",
  "profilePicture": "https://...",
  "phone": "+1-555-0001",
  "bio": "Tech enthusiast selling quality electronics",
  "rating": 4.5,
  "reviewCount": 12,
  "isActive": true,
  "role": "user",
  "suspensionReason": null,
  "lastLogin": null,
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

#### Items Collection (6 documents)
```json
{
  "_id": ObjectId("..."),
  "title": "MacBook Pro 13 2021",
  "description": "Excellent condition, minimal usage...",
  "category": "Electronics",
  "price": 999.99,
  "images": ["https://via.placeholder.com/400x300?text=MacBook+Pro"],
  "seller": ObjectId("..."),
  "sellerName": "John Doe",
  "condition": "like_new",
  "location": "San Francisco, CA",
  "status": "active",
  "views": 45,
  "favorites": [ObjectId("..."), ObjectId("...")],
  "isApproved": true,
  "approvedBy": ObjectId("..."),
  "rejectionReason": null,
  "expiresAt": ISODate("2024-03-20"),
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

#### Chats Collection (3 documents)
```json
{
  "_id": ObjectId("..."),
  "participants": [ObjectId("..."), ObjectId("...")],
  "itemId": ObjectId("..."),
  "itemTitle": "MacBook Pro 13 2021",
  "lastMessage": "Is this still available?",
  "lastMessageTime": ISODate("2024-01-20T12:00:00"),
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-20")
}
```

#### Messages Collection (7 documents)
```json
{
  "_id": ObjectId("..."),
  "chatId": ObjectId("..."),
  "senderId": ObjectId("..."),
  "senderName": "Jane Smith",
  "content": "Is this still available?",
  "isRead": true,
  "createdAt": ISODate("2024-01-20T12:00:00"),
  "updatedAt": ISODate("2024-01-20T12:00:00")
}
```

## Sample Data Details

### Users
| Email | Role | Rating | Status |
|-------|------|--------|--------|
| admin@marketplace.com | admin | 5.0 | Active |
| john@example.com | user | 4.5 | Active |
| jane@example.com | user | 4.8 | Active |
| mike@example.com | user | 4.2 | Active |
| sarah@example.com | user | 4.7 | Active |

### Items
| Title | Category | Price | Status | Approval |
|-------|----------|-------|--------|----------|
| MacBook Pro 13 2021 | Electronics | $999.99 | Active | ✓ Approved |
| Leather Sofa | Furniture | $750.00 | Active | ✓ Approved |
| Winter Jacket - XL | Clothing | $120.00 | Active | ✓ Approved |
| The Great Gatsby | Books | $250.00 | Active | ✓ Approved |
| Mountain Bike - Trek | Sports | $800.00 | Sold | ✓ Approved |
| Vintage Gaming Console | Electronics | $350.00 | Active | ✗ Pending |

### Chats & Messages
- **Chat 1:** Jane asking about MacBook (3 messages)
- **Chat 2:** Mike inquiring about sofa (2 messages)
- **Chat 3:** Sarah asking about shipping on book (2 messages)

## Running the Scripts

### Step 1: Ensure MongoDB is Connected
Before running any seed script, make sure:
1. MongoDB Atlas credentials are set in `.env`:
   ```env
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
2. Your IP is whitelisted in MongoDB Atlas

### Step 2: Run Seed Script
```bash
cd backend

# Seed admin only
node scripts/seed-admin.js

# OR seed complete database
node scripts/seed-database.js
```

### Step 3: Verify in MongoDB Atlas
1. Go to: https://www.mongodb.com/cloud/atlas
2. Select your cluster
3. Go to "Collections"
4. View the populated data:
   - users
   - items
   - chats
   - messages

## Optional: Clear Data Before Seeding

If you want to start fresh, uncomment the delete lines in `seed-database.js`:

```javascript
// Clear existing data
await Promise.all([
  User.deleteMany({}),
  Item.deleteMany({}),
  Chat.deleteMany({}),
  Message.deleteMany({}),
]);
console.log("✓ Cleared existing collections");
```

Then run the seed script.

## Verify Collection Structure

### Using MongoDB Compass
1. Download and install MongoDB Compass
2. Connect with your MongoDB Atlas URI
3. Select database: `hand2hand-marketplace`
4. Click on collections tab
5. View documents and structure

### Using MongoDB Shell
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/hand2hand-marketplace"

# Check collections
show collections

# Count documents in each collection
db.users.countDocuments()
db.items.countDocuments()
db.chats.countDocuments()
db.messages.countDocuments()

# View sample document
db.items.findOne()

# View with formatting
db.chats.findOne({}, {pretty: true})
```

### Using MongoDB Atlas Dashboard
1. Log in to Atlas
2. Go to "Collections" tab
3. Browse documents visually
4. See field types and structure

## Tips

1. **Run seed-admin.js first** to create the admin account
2. **Then run seed-database.js** to populate full data
3. **Check email uniqueness** - Users have unique emails, don't modify them
4. **References are proper** - All IDs follow database references pattern
5. **Timestamps included** - All documents have createdAt and updatedAt
6. **Realistic data** - Sample data is realistic for testing

## Troubleshooting

### "Connection refused" error
- Check MongoDB credentials in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure database name is `hand2hand-marketplace`

### "Email already exists" error
- Database already has users from previous seed
- Uncomment deletion lines to clear data first
- Or change email addresses in the script

### No documents created
- Check console output for errors
- Ensure MongoDB is accessible
- Verify credentials are correct
- Check that database exists in Atlas

