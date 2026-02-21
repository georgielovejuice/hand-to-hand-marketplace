import { BaseRepository } from "./BaseRepository.js";
import { Item } from "../models/Item.js";

/**
 * Item Repository - Handles all item data access
 */
export class ItemRepository extends BaseRepository {
  constructor() {
    super(Item);
  }

  async findBySeller(sellerId, options = {}) {
    return this.findMany(
      { seller: sellerId, status: "active" },
      options
    );
  }

  async findByCategory(category, page = 1, limit = 20) {
    return this.paginate(
      { category, status: "active" },
      page,
      limit
    );
  }

  async searchItems(query, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const items = await this.model
        .find(
          {
            $text: { $search: query },
            status: "active",
          },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.model.countDocuments({
        $text: { $search: query },
        status: "active",
      });

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async incrementViews(itemId) {
    try {
      return await this.model.findByIdAndUpdate(
        itemId,
        { $inc: { views: 1 } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to increment views: ${error.message}`);
    }
  }

  async addFavorite(itemId, userId) {
    try {
      return await this.model.findByIdAndUpdate(
        itemId,
        { $addToSet: { favorites: userId } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  async removeFavorite(itemId, userId) {
    try {
      return await this.model.findByIdAndUpdate(
        itemId,
        { $pull: { favorites: userId } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }
}

export default new ItemRepository();
