import mongoose from "mongoose";
import { databaseUsername, databasePassword } from "./credentials.js";

// MongoDB connection URL with database name included
const databaseURL = `mongodb+srv://${databaseUsername}:${databasePassword}@auctiondraftcluster.cmlfgox.mongodb.net/hand2hand-marketplace`;

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return mongoose;

    try {
      await mongoose.connect(databaseURL, {
        retryWrites: true,
        w: "majority",
      });

      this.isConnected = true;
      if (process.env.NODE_ENV !== "production") {
        console.log("✓ MongoDB connected successfully");
        console.log(`✓ Database: hand2hand-marketplace`);
      }
      return mongoose;
    } catch (error) {
      console.error("✗ MongoDB connection failed:", error.message);
      process.exit(1);
    }
  }

  getConnection() {
    if (!this.isConnected) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return mongoose;
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("✓ MongoDB disconnected");
    }
  }
}

export default new DatabaseConnection();
