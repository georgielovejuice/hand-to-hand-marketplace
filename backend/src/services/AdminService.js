import UserRepository from "../repositories/UserRepository.js";
import ItemRepository from "../repositories/ItemRepository.js";
import { NotFoundError, AuthorizationError } from "../errors/AppError.js";
import { validateSuspendUser, validateRejectItem, validateRemoveItem } from "../validators/adminValidator.js";

/**
 * Admin Service - Handles business logic for admin operations
 */
export class AdminService {
  /**
   * Get dashboard analytics
   */
  async getDashboard() {
    const totalUsers = await UserRepository.count();
    const totalItems = await ItemRepository.count();
    const totalAdmins = await UserRepository.count({ role: "admin" });
    const activeItems = await ItemRepository.count({ status: "active" });
    const soldItems = await ItemRepository.count({ status: "sold" });

    return {
      dashboard: {
        totalUsers,
        totalItems,
        totalAdmins,
        activeItems,
        soldItems,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Get all users (paginated)
   */
  async getAllUsers(page = 1, limit = 20, role = null) {
    const filter = role ? { role } : {};
    return UserRepository.paginate(filter, page, limit);
  }

  /**
   * Get user details
   */
  async getUserDetails(userId) {
    const user = await UserRepository.findByIdWithProfile(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId, reason) {
    validateSuspendUser({ reason });
    
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.role === "admin") {
      throw new AuthorizationError("Cannot suspend admin users");
    }

    await UserRepository.updateById(userId, {
      isActive: false,
      suspensionReason: reason || "Account suspended by admin",
    });

    return { message: "User suspended successfully" };
  }

  /**
   * Activate user account
   */
  async activateUser(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    await UserRepository.updateById(userId, {
      isActive: true,
      suspensionReason: null,
    });

    return { message: "User activated successfully" };
  }

  /**
   * Get all items (paginated)
   */
  async getAllItems(page = 1, limit = 20, status = null) {
    const filter = status ? { status } : {};
    return ItemRepository.paginate(filter, page, limit);
  }

  /**
   * Approve item listing
   */
  async approveItem(itemId, adminId) {
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    await ItemRepository.updateById(itemId, {
      isApproved: true,
      approvedBy: adminId,
      rejectionReason: null,
    });

    return { message: "Item approved successfully" };
  }

  /**
   * Reject item listing
   */
  async rejectItem(itemId, rejectionReason) {
    validateRejectItem({ reason: rejectionReason });
    
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    await ItemRepository.updateById(itemId, {
      isApproved: false,
      rejectionReason:
        rejectionReason || "Item rejected by admin for policy violation",
    });

    return { message: "Item rejected successfully" };
  }

  /**
   * Remove item from marketplace
   */
  async removeItem(itemId, removalReason) {
    validateRemoveItem({ reason: removalReason });
    
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    await ItemRepository.updateById(itemId, {
      status: "removed",
      rejectionReason: removalReason || "Item removed by admin",
    });

    return { message: "Item removed successfully" };
  }

  /**
   * Get unapproved items
   */
  async getUnapprovedItems(page = 1, limit = 20) {
    return ItemRepository.paginate(
      { isApproved: false },
      page,
      limit
    );
  }

  /**
   * Get system statistics
   */
  async getStatistics() {
    const stats = {
      users: {
        total: await UserRepository.count(),
        active: await UserRepository.count({ isActive: true }),
        suspended: await UserRepository.count({ isActive: false }),
        admins: await UserRepository.count({ role: "admin" }),
      },
      items: {
        total: await ItemRepository.count(),
        active: await ItemRepository.count({ status: "active" }),
        sold: await ItemRepository.count({ status: "sold" }),
        removed: await ItemRepository.count({ status: "removed" }),
        approved: await ItemRepository.count({ isApproved: true }),
        unapproved: await ItemRepository.count({ isApproved: false }),
      },
      timestamp: new Date(),
    };

    return stats;
  }
}

export default new AdminService();
