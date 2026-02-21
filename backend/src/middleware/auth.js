import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/credentials.js";
import { AuthenticationError, AuthorizationError } from "../errors/AppError.js";

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return next(new AuthenticationError("Missing authentication token"));
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // { userId, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AuthenticationError("Token expired"));
    }
    next(new AuthenticationError("Invalid token"));
  }
};

/**
 * Middleware to verify admin role
 */
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AuthorizationError("Admin access required"));
  }
  next();
};

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "2h",
  });
};

export default { verifyToken, verifyAdmin, generateToken };
