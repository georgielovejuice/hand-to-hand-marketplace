import express from "express";
import cors from "cors";
import database from "./config/database.js";
import { errorHandler } from "./errors/errorHandler.js";
import { requestLogger, securityHeaders } from "./middleware/index.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

/**
 * Create and configure Express application
 */
export async function createApp() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // CORS Configuration
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  
  app.use(securityHeaders);
  app.use(requestLogger);

  // Initialize database connection
  await database.connect();

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/uploads", uploadRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: {
        message: "Endpoint not found",
        code: "NOT_FOUND",
        statusCode: 404,
      },
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
