import { AppError, ValidationError } from "./AppError.js";

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log errors only in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  }

  // Handle validation errors from validators
  if (err.hasOwnProperty("statusCode") && err.hasOwnProperty("code")) {
    return res.status(err.statusCode).json(err.toJSON?.() || err);
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle MongoDB errors
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      error: {
        message: "Database error occurred",
        code: "DATABASE_ERROR",
        statusCode: 500,
      },
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: 500,
    },
  });
};

/**
 * Async route wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
