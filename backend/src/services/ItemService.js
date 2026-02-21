import ItemRepository from "../repositories/ItemRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { NotFoundError } from "../errors/AppError.js";
import { validateCreateItem, validateUpdateItem, validateQueryItems } from "../validators/itemValidator.js";
import { ITEM_STATUS } from "../config/constants.js";

/**
 * Item Service - Handles business logic for items
 */
export class ItemService {
  /**
   * Create a new item
   */
  async createItem(sellerId, itemData) {
    // Validate inputs
    validateCreateItem(itemData);

    // Get seller info
    const seller = await UserRepository.findByIdWithProfile(sellerId);
    if (!seller) {
      throw new NotFoundError("Seller");
    }

    // Create item
    const item = await ItemRepository.create({
      ...itemData,
      seller: sellerId,
      sellerName: seller.name,
      status: ITEM_STATUS.ACTIVE,
      views: 0,
      favorites: [],
    });

    return item;
  }

  /**
   * Get all items
   */
  async getAllItems() {
    return await ItemRepository.findMany({}, { sort: { createdAt: -1 } });
  }

  /**
   * Get item by ID
   */
  async getItemById(itemId) {
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    // Increment views
    await ItemRepository.incrementViews(itemId);

    return item;
  }

  /**
   * Get items by seller
   */
  async getItemsBySeller(sellerId) {
    return ItemRepository.findBySeller(sellerId);
  }

  /**
   * Get items by category
   */
  async getItemsByCategory(category, page = 1, limit = 20) {
    validateQueryItems({ page, limit });
    return ItemRepository.findByCategory(category, page, limit);
  }

  /**
   * Search items
   */
  async searchItems(query, page = 1, limit = 20) {
    validateQueryItems({ page, limit });

    if (!query || query.trim().length === 0) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }

    return ItemRepository.searchItems(query, page, limit);
  }

  /**
   * Update item
   */
  async updateItem(itemId, sellerId, updateData) {
    // Validate inputs
    validateUpdateItem(updateData);

    // Get item
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    // Verify seller owns the item
    if (item.seller.toString() !== sellerId) {
      throw new NotFoundError("Item");
    }

    // Update item
    const success = await ItemRepository.updateById(itemId, updateData);
    if (!success) {
      throw new NotFoundError("Item");
    }

    return ItemRepository.findById(itemId);
  }

  /**
   * Delete item
   */
  async deleteItem(itemId, sellerId) {
    // Get item
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    // Verify seller owns the item
    if (item.seller.toString() !== sellerId) {
      throw new NotFoundError("Item");
    }

    // Delete item
    const success = await ItemRepository.deleteById(itemId);
    if (!success) {
      throw new NotFoundError("Item");
    }

    return { message: "Item deleted successfully" };
  }

  /**
   * Add item to favorites
   */
  async addFavorite(itemId, userId) {
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    await ItemRepository.addFavorite(itemId, userId);
    return { message: "Item added to favorites" };
  }

  /**
   * Remove item from favorites
   */
  async removeFavorite(itemId, userId) {
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item");
    }

    await ItemRepository.removeFavorite(itemId, userId);
    return { message: "Item removed from favorites" };
  }
}

export default new ItemService();
