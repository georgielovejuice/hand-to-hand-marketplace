import ChatRepository from "../repositories/ChatRepository.js";
import MessageRepository from "../repositories/MessageRepository.js";
import { NotFoundError } from "../errors/AppError.js";
import { validateStartChat, validateCreateMessage } from "../validators/chatValidator.js";

/**
 * Chat Service - Handles business logic for chats
 */
export class ChatService {
  /**
   * Start a new chat or get existing
   */
  async startChat(userId1, userId2, itemId) {
    // Validate inputs
    validateStartChat({ userId: userId2, itemId });

    // Create or get existing chat
    const chat = await ChatRepository.findOrCreateChat(userId1, userId2, itemId);
    return chat;
  }

  /**
   * Get user's chats
   */
  async getUserChats(userId) {
    return ChatRepository.findUserChats(userId);
  }

  /**
   * Send message
   */
  async sendMessage(chatId, senderId, senderName, content) {
    // Validate inputs
    validateCreateMessage({ chatId, content });

    // Verify chat exists
    const chat = await ChatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundError("Chat");
    }

    // Create message
    const message = await MessageRepository.createMessage(
      chatId,
      senderId,
      senderName,
      content
    );

    // Update chat's last message
    await ChatRepository.updateLastMessage(chatId, content, new Date());

    return message;
  }

  /**
   * Get messages from a chat
   */
  async getMessages(chatId, limit = 50) {
    // Verify chat exists
    const chat = await ChatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundError("Chat");
    }

    return MessageRepository.findByChatId(chatId, limit);
  }
}

export default new ChatService();
