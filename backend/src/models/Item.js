import mongoose from "mongoose";

/**
 * Item Schema
 */
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Furniture",
        "Clothing",
        "Books",
        "Sports",
        "Toys",
        "Home & Garden",
        "Art & Crafts",
        "Other",
      ],
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String], // S3 keys (NOT full URLs) - e.g., "items/userId/uuid.jpg"
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair", "used"],
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
itemSchema.index({ title: "text", description: "text" });

export const Item = mongoose.model("Item", itemSchema, "items");
