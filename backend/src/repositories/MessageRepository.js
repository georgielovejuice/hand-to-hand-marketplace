import { BaseRepository } from "./BaseRepository.js";
import { Message } from "../models/Message.js";

/**
 * Message Repository - Handles all message data access
 */
export class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  async findByChatId(chatId, limit = 50) {
    try {
      return await this.model
        .find({ chatId })
        .populate("senderId", "name profilePicture")
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Failed to find messages: ${error.message}`);
    }
  }

  async createMessage(chatId, senderId, senderName, content) {
    return this.create({
      chatId,
      senderId,
      senderName,
      content,
      isRead: false,
    });
  }

  async markAsRead(messageIds) {
    try {
      return await this.model.updateMany(
        { _id: { $in: messageIds } },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }
}

export default new MessageRepository();
