import AdminService from "../services/AdminService.js";
import { asyncHandler } from "../errors/errorHandler.js";

/**
 * Admin Controller - Handles HTTP requests for admin operations
 */
export class AdminController {
  /**
   * Get dashboard analytics
   * GET /api/admin/dashboard
   */
  getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await AdminService.getDashboard();
    res.status(200).json(dashboard);
  });

  /**
   * Get system statistics
   * GET /api/admin/statistics
   */
  getStatistics = asyncHandler(async (req, res) => {
    const stats = await AdminService.getStatistics();
    res.status(200).json(stats);
  });

  /**
   * Get all users
   * GET /api/admin/users?page=1&limit=20&role=user
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role } = req.query;
    const result = await AdminService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      role
    );
    res.status(200).json(result);
  });

  /**
   * Get user details
   * GET /api/admin/users/:userId
   */
  getUserDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await AdminService.getUserDetails(userId);
    res.status(200).json(user);
  });

  /**
   * Suspend user
   * POST /api/admin/users/:userId/suspend
   */
  suspendUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { reason } = req.body;
    const result = await AdminService.suspendUser(userId, reason);
    res.status(200).json(result);
  });

  /**
   * Activate user
   * POST /api/admin/users/:userId/activate
   */
  activateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await AdminService.activateUser(userId);
    res.status(200).json(result);
  });

  /**
   * Get all items
   * GET /api/admin/items?page=1&limit=20&status=active
   */
  getAllItems = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const result = await AdminService.getAllItems(
      parseInt(page),
      parseInt(limit),
      status
    );
    res.status(200).json(result);
  });

  /**
   * Get unapproved items
   * GET /api/admin/items/unapproved
   */
  getUnapprovedItems = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await AdminService.getUnapprovedItems(
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(result);
  });

  /**
   * Approve item
   * POST /api/admin/items/:itemId/approve
   */
  approveItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const adminId = req.user.userId;
    const result = await AdminService.approveItem(itemId, adminId);
    res.status(200).json(result);
  });

  /**
   * Reject item
   * POST /api/admin/items/:itemId/reject
   */
  rejectItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { reason } = req.body;
    const result = await AdminService.rejectItem(itemId, reason);
    res.status(200).json(result);
  });

  /**
   * Remove item
   * POST /api/admin/items/:itemId/remove
   */
  removeItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { reason } = req.body;
    const result = await AdminService.removeItem(itemId, reason);
    res.status(200).json(result);
  });
}

export default new AdminController();
