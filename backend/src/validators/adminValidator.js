import { ValidationError } from "../errors/AppError.js";

/**
 * Admin Validators
 */
export const validateSuspendUser = (data) => {
  const errors = {};

  if (data.reason && typeof data.reason !== "string") {
    errors.reason = "Reason must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateRejectItem = (data) => {
  const errors = {};

  if (data.reason && typeof data.reason !== "string") {
    errors.reason = "Reason must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

export const validateRemoveItem = (data) => {
  const errors = {};

  if (data.reason && typeof data.reason !== "string") {
    errors.reason = "Reason must be a string";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};
