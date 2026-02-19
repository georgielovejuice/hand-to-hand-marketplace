import { BaseRepository } from "./BaseRepository.js";
import { Chat } from "../models/Chat.js";

/**
 * Chat Repository - Handles all chat data access
 */
export class ChatRepository extends BaseRepository {
  constructor() {
    super(Chat);
  }

  async findUserChats(userId) {
    try {
      return await this.model
        .find({ participants: { $in: [userId] } })
        .populate("participants", "name profilePicture")
        .populate("itemId", "title price images")
        .sort({ updatedAt: -1 })
        .exec();
    } catch (error) {
      throw new Error(`Failed to find user chats: ${error.message}`);
    }
  }

  async findOrCreateChat(userId1, userId2, itemId) {
    try {
      // Find existing chat
      const existingChat = await this.model.findOne({
        participants: { $all: [userId1, userId2] },
        itemId,
      });

      if (existingChat) {
        return existingChat;
      }

      // Create new chat
      const newChat = new this.model({
        participants: [userId1, userId2],
        itemId,
      });

      return await newChat.save();
    } catch (error) {
      throw new Error(`Failed to find or create chat: ${error.message}`);
    }
  }

  async updateLastMessage(chatId, message, messageTime) {
    try {
      return await this.model.findByIdAndUpdate(
        chatId,
        {
          $set: {
            lastMessage: message,
            lastMessageTime: messageTime,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to update last message: ${error.message}`);
    }
  }
}

export default new ChatRepository();
