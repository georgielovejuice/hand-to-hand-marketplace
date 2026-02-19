import mongoose from "mongoose";

/**
 * Chat Schema
 */
const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding chats between two users
chatSchema.index({ participants: 1, itemId: 1 });

export const Chat = mongoose.model("Chat", chatSchema, "chats");
