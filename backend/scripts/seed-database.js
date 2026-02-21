/**
 * Seed Database Script
 * Creates sample data for all collections to see structure
 * Usage: node scripts/seed-database.js
 */

import mongoose from "mongoose";
import { databaseUsername, databasePassword } from "../src/config/credentials.js";
import { User } from "../src/models/User.js";
import { Item } from "../src/models/Item.js";
import { Chat } from "../src/models/Chat.js";
import { Message } from "../src/models/Message.js";
import bcrypt from "bcrypt";

const databaseURL = `mongodb+srv://${databaseUsername}:${databasePassword}@auctiondraftcluster.cmlfgox.mongodb.net/hand2hand-marketplace`;

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(databaseURL, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✓ Connected to MongoDB");

    // Clear existing data (optional - comment out to keep data)
    // await Promise.all([
    //   User.deleteMany({}),
    //   Item.deleteMany({}),
    //   Chat.deleteMany({}),
    //   Message.deleteMany({}),
    // ]);
    // console.log("✓ Cleared existing collections");

    // 1. Create Users
    console.log("\n📝 Creating Users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "kimmy Admin",
        email: "kim@test.com",
        hashedPassword: await bcrypt.hash("12341234", 10),
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        phone: "+1-800-ADMIN",
        bio: "Marketplace Administrator",
        rating: 5,
        reviewCount: 0,
        isActive: true,
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        hashedPassword,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        phone: "+1-555-0001",
        bio: "Tech enthusiast selling quality electronics",
        rating: 4.5,
        reviewCount: 12,
        isActive: true,
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        hashedPassword,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        phone: "+1-555-0002",
        bio: "Furniture and home goods seller",
        rating: 4.8,
        reviewCount: 23,
        isActive: true,
        role: "user",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        hashedPassword,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        phone: "+1-555-0003",
        bio: "Clothing and accessories",
        rating: 4.2,
        reviewCount: 8,
        isActive: true,
        role: "user",
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        hashedPassword,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        phone: "+1-555-0004",
        bio: "Books and collectibles",
        rating: 4.7,
        reviewCount: 15,
        isActive: true,
        role: "user",
      },
    ]);

    console.log(`✓ Created ${users.length} users`);
    console.log(`  - Admin: ${users[0].email}`);
    users.slice(1).forEach((u) => console.log(`  - User: ${u.email}`));

    // 2. Create Items
    console.log("\n📝 Creating Items...");
    const items = await Item.insertMany([
      {
        title: "MacBook Pro 13 2021",
        description: "Excellent condition, minimal usage, original box included. M1 chip, 8GB RAM, 256GB SSD.",
        category: "Electronics",
        price: 999.99,
        images: ["https://via.placeholder.com/400x300?text=MacBook+Pro"],
        seller: users[1]._id,
        sellerName: users[1].name,
        condition: "like_new",
        location: "San Francisco, CA",
        status: "active",
        views: 45,
        favorites: [users[2]._id, users[3]._id],
        isApproved: true,
        approvedBy: users[0]._id,
      },
      {
        title: "Leather Sofa",
        description: "Modern design, black leather, perfect for living room. Recently upholstered.",
        category: "Furniture",
        price: 750.0,
        images: ["https://via.placeholder.com/400x300?text=Leather+Sofa"],
        seller: users[2]._id,
        sellerName: users[2].name,
        condition: "good",
        location: "New York, NY",
        status: "active",
        views: 32,
        favorites: [users[1]._id],
        isApproved: true,
        approvedBy: users[0]._id,
      },
      {
        title: "Winter Jacket - XL",
        description: "North Face winter jacket, water-resistant, very warm. Only worn twice.",
        category: "Clothing",
        price: 120.0,
        images: ["https://via.placeholder.com/400x300?text=Winter+Jacket"],
        seller: users[3]._id,
        sellerName: users[3].name,
        condition: "like_new",
        location: "Denver, CO",
        status: "active",
        views: 18,
        favorites: [],
        isApproved: true,
        approvedBy: users[0]._id,
      },
      {
        title: "The Great Gatsby - First Edition",
        description: "Classic literature, hardcover, excellent condition. Collector's item.",
        category: "Books",
        price: 250.0,
        images: ["https://via.placeholder.com/400x300?text=The+Great+Gatsby"],
        seller: users[4]._id,
        sellerName: users[4].name,
        condition: "good",
        location: "Boston, MA",
        status: "active",
        views: 28,
        favorites: [users[2]._id, users[3]._id, users[1]._id],
        isApproved: true,
        approvedBy: users[0]._id,
      },
      {
        title: "Mountain Bike - Trek",
        description: "Trek X-Caliber 29er mountain bike. 19 inch frame, upgraded components.",
        category: "Sports",
        price: 800.0,
        images: ["https://via.placeholder.com/400x300?text=Mountain+Bike"],
        seller: users[1]._id,
        sellerName: users[1].name,
        condition: "good",
        location: "Seattle, WA",
        status: "sold",
        views: 62,
        favorites: [users[3]._id],
        isApproved: true,
        approvedBy: users[0]._id,
      },
      {
        title: "Vintage Gaming Console",
        description: "SNES console with 2 controllers and 5 games. Fully functional.",
        category: "Electronics",
        price: 350.0,
        images: ["https://via.placeholder.com/400x300?text=SNES+Console"],
        seller: users[2]._id,
        sellerName: users[2].name,
        condition: "fair",
        location: "Austin, TX",
        status: "active",
        views: 55,
        favorites: [users[1]._id, users[4]._id],
        isApproved: false,
        rejectionReason: "Pending admin approval",
      },
    ]);

    console.log(`✓ Created ${items.length} items`);
    console.log(`  - Electronics: ${items.filter((i) => i.category === "Electronics").length}`);
    console.log(`  - Furniture: ${items.filter((i) => i.category === "Furniture").length}`);
    console.log(`  - Clothing: ${items.filter((i) => i.category === "Clothing").length}`);
    console.log(`  - Books: ${items.filter((i) => i.category === "Books").length}`);
    console.log(`  - Sports: ${items.filter((i) => i.category === "Sports").length}`);

    // 3. Create Chats
    console.log("\n📝 Creating Chats...");
    const chats = await Chat.insertMany([
      {
        participants: [users[2]._id, users[1]._id],
        itemId: items[0]._id,
        itemTitle: items[0].title,
        lastMessage: "Is this still available?",
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        participants: [users[3]._id, users[2]._id],
        itemId: items[1]._id,
        itemTitle: items[1].title,
        lastMessage: "What's the lowest price?",
        lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        participants: [users[4]._id, users[1]._id],
        itemId: items[3]._id,
        itemTitle: items[3].title,
        lastMessage: "Can you ship internationally?",
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ]);

    console.log(`✓ Created ${chats.length} chats`);
    chats.forEach((c, i) => {
      console.log(`  - Chat ${i + 1}: "${c.itemTitle}" between 2 users`);
    });

    // 4. Create Messages
    console.log("\n📝 Creating Messages...");
    const messages = await Message.insertMany([
      // Chat 1 messages
      {
        chatId: chats[0]._id,
        senderId: users[2]._id,
        senderName: users[2].name,
        content: "Is this still available?",
        isRead: true,
      },
      {
        chatId: chats[0]._id,
        senderId: users[1]._id,
        senderName: users[1].name,
        content: "Yes, it is! Still in perfect condition. Can ship within 24 hours.",
        isRead: true,
      },
      {
        chatId: chats[0]._id,
        senderId: users[2]._id,
        senderName: users[2].name,
        content: "Great! Can you do $950?",
        isRead: false,
      },

      // Chat 2 messages
      {
        chatId: chats[1]._id,
        senderId: users[3]._id,
        senderName: users[3].name,
        content: "What's the lowest price you can do?",
        isRead: true,
      },
      {
        chatId: chats[1]._id,
        senderId: users[2]._id,
        senderName: users[2].name,
        content: "It's a great piece, asking $750 is fair. Slight negotiation possible.",
        isRead: true,
      },

      // Chat 3 messages
      {
        chatId: chats[2]._id,
        senderId: users[4]._id,
        senderName: users[4].name,
        content: "Can you ship internationally?",
        isRead: true,
      },
      {
        chatId: chats[2]._id,
        senderId: users[1]._id,
        senderName: users[1].name,
        content: "Yes, I can ship to most countries. Shipping would be around $25-40 depending on location.",
        isRead: false,
      },
    ]);

    console.log(`✓ Created ${messages.length} messages`);
    console.log(`  - Unread: ${messages.filter((m) => !m.isRead).length}`);
    console.log(`  - Read: ${messages.filter((m) => m.isRead).length}`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✓ DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\nCollection Summary:");
    console.log(`  📦 Users: ${users.length}`);
    console.log(`  📦 Items: ${items.length}`);
    console.log(`  📦 Chats: ${chats.length}`);
    console.log(`  📦 Messages: ${messages.length}`);
    console.log("\nDatabase: hand2hand-marketplace");
    console.log("Collections: users, items, chats, messages");
    console.log("\nYou can now view the data in MongoDB Atlas!");

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();
