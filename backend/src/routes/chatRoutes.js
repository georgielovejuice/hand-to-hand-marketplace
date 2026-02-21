import express from "express";
import ChatController from "../controllers/ChatController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All chat routes are protected
router.use(verifyToken);

router.post("/", ChatController.startChat);
router.get("/", ChatController.getUserChats);
router.post("/:chatId/messages", ChatController.sendMessage);
router.get("/:chatId/messages", ChatController.getMessages);

export default router;
