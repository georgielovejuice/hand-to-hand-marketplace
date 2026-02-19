import { ValidationError } from "../errors/AppError.js";

/**
 * Item Validators
 */
export const validateCreateItem = (data) => {
  const errors = {};

  if (!data.title || typeof data.title !== "string") {
    errors.title = "Title is required";
  } else if (data.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!data.description || typeof data.description !== "string") {
    errors.description = "Description is required";
  }

  if (!data.price || typeof data.price !== "number" || data.price <= 0) {
    errors.price = "Valid price is required";
  }

  if (!data.category || typeof data.category !== "string") {
    errors.category = "Category is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateUpdateItem = (data) => {
  const errors = {};

  if (data.title && typeof data.title !== "string") {
    errors.title = "Title must be a string";
  }

  if (data.price && (typeof data.price !== "number" || data.price <= 0)) {
    errors.price = "Price must be a positive number";
  }

  if (data.status && !["active", "sold", "removed"].includes(data.status)) {
    errors.status = "Invalid status";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateQueryItems = (query) => {
  const errors = {};

  if (query.page && (typeof query.page !== "number" || query.page < 1)) {
    errors.page = "Page must be a positive number";
  }

  if (query.limit && (typeof query.limit !== "number" || query.limit < 1)) {
    errors.limit = "Limit must be a positive number";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};
