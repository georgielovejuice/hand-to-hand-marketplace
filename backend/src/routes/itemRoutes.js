import express from "express";
import ItemController from "../controllers/ItemController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes - specific routes first, then generic
router.get("/", ItemController.getItems);  // Get all items
router.post("/query", ItemController.queryItems);  // Query items with filters
router.get("/search", ItemController.searchItems);
router.get("/category/:category", ItemController.getItemsByCategory);
router.get("/seller/:sellerId", ItemController.getSellerItems);
router.get("/:id", ItemController.getItem);

// Protected routes
router.post("/", verifyToken, ItemController.createItem);
router.put("/:id", verifyToken, ItemController.updateItem);
router.delete("/:id", verifyToken, ItemController.deleteItem);

// Favorites
router.post("/:id/favorite", verifyToken, ItemController.addFavorite);
router.delete("/:id/favorite", verifyToken, ItemController.removeFavorite);

export default router;

