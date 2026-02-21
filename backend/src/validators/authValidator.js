import { ValidationError } from "../errors/AppError.js";

/**
 * Auth Validators
 */
export const validateRegister = (data) => {
  const errors = {};

  if (!data.email || typeof data.email !== "string") {
    errors.email = "Valid email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || typeof data.password !== "string") {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (data.name && typeof data.name !== "string") {
    errors.name = "Name must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateLogin = (data) => {
  const errors = {};

  if (!data.email || typeof data.email !== "string") {
    errors.email = "Email is required";
  }

  if (!data.password || typeof data.password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateProfileUpdate = (data) => {
  const errors = {};

  if (data.email && typeof data.email !== "string") {
    errors.email = "Email must be a string";
  }

  if (data.name && typeof data.name !== "string") {
    errors.name = "Name must be a string";
  }

  if (data.phone && typeof data.phone !== "string") {
    errors.phone = "Phone must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};
