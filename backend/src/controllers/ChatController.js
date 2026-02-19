import ChatService from "../services/ChatService.js";
import { asyncHandler } from "../errors/errorHandler.js";

/**
 * Chat Controller - Handles HTTP requests for chats
 */
export class ChatController {
  /**
   * Start chat endpoint
   * POST /api/chats
   */
  startChat = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { otherUserId, itemId } = req.body;

    const chat = await ChatService.startChat(userId, otherUserId, itemId);

    res.status(201).json({
      message: "Chat started successfully",
      chat,
    });
  });

  /**
   * Get user's chats
   * GET /api/chats
   */
  getUserChats = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const chats = await ChatService.getUserChats(userId);

    res.status(200).json({ chats });
  });

  /**
   * Send message endpoint
   * POST /api/chats/:chatId/messages
   */
  sendMessage = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const senderId = req.user.userId;
    const { content, senderName } = req.body;

    const message = await ChatService.sendMessage(
      chatId,
      senderId,
      senderName,
      content
    );

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  });

  /**
   * Get messages endpoint
   * GET /api/chats/:chatId/messages
   */
  getMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const { limit = 50 } = req.query;

    const messages = await ChatService.getMessages(chatId, parseInt(limit));

    res.status(200).json({ messages });
  });
}

export default new ChatController();
