/**
 * Seed Admin User Script
 * Usage: node scripts/seed-admin.js
 */

import mongoose from "mongoose";
import { User } from "../src/models/User.js";
import { databaseUsername, databasePassword } from "../src/config/credentials.js";
import bcrypt from "bcrypt";

const databaseURL = `mongodb+srv://${databaseUsername}:${databasePassword}@auctiondraftcluster.cmlfgox.mongodb.net/hand2hand-marketplace`;

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(databaseURL, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✓ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@marketplace.com" });
    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123456", 10);

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@marketplace.com",
      hashedPassword,
      profilePicture:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
      phone: "admin@company.com",
      bio: "Administrator of Hand-to-Hand Marketplace",
      rating: 5,
      reviewCount: 0,
      isActive: true,
      role: "admin",
    });

    await adminUser.save();
    console.log("✓ Admin user created successfully");
    console.log("  Email: admin@marketplace.com");
    console.log("  Password: admin123456");

    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
