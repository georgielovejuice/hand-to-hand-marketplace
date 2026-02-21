import express from "express";
import AdminController from "../controllers/AdminController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes are protected
router.use(verifyToken, verifyAdmin);

// Dashboard & Statistics
router.get("/dashboard", AdminController.getDashboard);
router.get("/statistics", AdminController.getStatistics);

// User Management
router.get("/users", AdminController.getAllUsers);
router.get("/users/:userId", AdminController.getUserDetails);
router.post("/users/:userId/suspend", AdminController.suspendUser);
router.post("/users/:userId/activate", AdminController.activateUser);

// Item Management - specific routes first
router.get("/items/unapproved", AdminController.getUnapprovedItems);
router.post("/items/:itemId/approve", AdminController.approveItem);
router.post("/items/:itemId/reject", AdminController.rejectItem);
router.post("/items/:itemId/remove", AdminController.removeItem);
router.get("/items", AdminController.getAllItems);

export default router;
