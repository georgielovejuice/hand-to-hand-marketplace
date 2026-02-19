import { ValidationError } from "../errors/AppError.js";

/**
 * Chat Validators
 */
export const validateCreateMessage = (data) => {
  const errors = {};

  if (!data.content || typeof data.content !== "string") {
    errors.content = "Message content is required";
  } else if (data.content.trim().length === 0) {
    errors.content = "Message cannot be empty";
  } else if (data.content.length > 5000) {
    errors.content = "Message is too long (max 5000 characters)";
  }

  if (!data.chatId || typeof data.chatId !== "string") {
    errors.chatId = "Chat ID is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateStartChat = (data) => {
  const errors = {};

  if (!data.userId || typeof data.userId !== "string") {
    errors.userId = "User ID is required";
  }

  if (!data.itemId || typeof data.itemId !== "string") {
    errors.itemId = "Item ID is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};
