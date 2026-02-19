import ItemService from "../services/ItemService.js";
import { asyncHandler } from "../errors/errorHandler.js";
import { getS3Url } from "../utils/s3Helper.js";

/**
 * Item Controller - Handles HTTP requests for items
 */
export class ItemController {
  /**
   * Helper: Convert S3 keys to full URLs
   */
  #enrichItemWithUrls(item) {
    if (!item) return item;
    
    const plainItem = item.toObject ? item.toObject() : item;
    
    if (plainItem.images && Array.isArray(plainItem.images)) {
      plainItem.images = plainItem.images.map(key => getS3Url(key));
    }
    
    return plainItem;
  }

  /**
   * Helper: Convert array of items
   */
  #enrichItemsWithUrls(items) {
    if (!Array.isArray(items)) return items;
    return items.map(item => this.#enrichItemWithUrls(item));
  }

  /**
   * Create item endpoint
   * POST /api/items
   */
  createItem = asyncHandler(async (req, res) => {
    const sellerId = req.user.userId;

    const item = await ItemService.createItem(sellerId, req.body);
    const enrichedItem = this.#enrichItemWithUrls(item);

    res.status(201).json({
      message: "Item created successfully",
      item: enrichedItem,
    });
  });

  /**
   * Get all items or search/filter items
   * GET /api/items or POST /api/items/query
   */
  getItems = asyncHandler(async (req, res) => {
    const items = await ItemService.getAllItems();
    const enrichedItems = this.#enrichItemsWithUrls(items);

    res.status(200).json(enrichedItems);
  });

  /**
   * Query items with filters (for backward compatibility)
   * POST /api/items/query
   */
  queryItems = asyncHandler(async (req, res) => {
    const { searchBarText = "", query = {} } = req.body;

    // Get all items and filter on server side
    let items = await ItemService.getAllItems();

    // Apply query filters
    if (query && Object.keys(query).length > 0) {
      items = items.filter(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
    }

    // Apply search filter
    if (searchBarText && searchBarText.trim()) {
      const searchLower = searchBarText.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    const enrichedItems = this.#enrichItemsWithUrls(items);
    res.status(200).json({
      items: enrichedItems,
      pagination: {
        page: 1,
        limit: items.length,
        total: items.length,
        pages: 1
      }
    });
  });

  /**
   * Get item endpoint
   * GET /api/items/:id
   */
  getItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;

    const item = await ItemService.getItemById(itemId);
    const enrichedItem = this.#enrichItemWithUrls(item);

    res.status(200).json(enrichedItem);
  });


  /**
   * Get items by seller
   * GET /api/items/seller/:sellerId
   */
  getSellerItems = asyncHandler(async (req, res) => {
    const sellerId = req.params.sellerId;

    const items = await ItemService.getItemsBySeller(sellerId);
    const enrichedItems = this.#enrichItemsWithUrls(items);

    res.status(200).json({ items: enrichedItems });
  });

  /**
   * Get items by category
   * GET /api/items/category/:category
   */
  getItemsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await ItemService.getItemsByCategory(
      category,
      parseInt(page),
      parseInt(limit)
    );

    const enrichedItems = this.#enrichItemsWithUrls(result.items);

    res.status(200).json({
      items: enrichedItems,
      pagination: result.pagination,
    });
  });

  /**
   * Search items
   * GET /api/items/search?q=query
   */
  searchItems = asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 20 } = req.query;

    const result = await ItemService.searchItems(q, parseInt(page), parseInt(limit));
    
    const enrichedItems = this.#enrichItemsWithUrls(result.items);

    res.status(200).json({
      items: enrichedItems,
      pagination: result.pagination,
    });
  });

  /**
   * Update item endpoint
   * PUT /api/items/:id
   */
  updateItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const sellerId = req.user.userId;

    const item = await ItemService.updateItem(itemId, sellerId, req.body);
    const enrichedItem = this.#enrichItemWithUrls(item);

    res.status(200).json({
      message: "Item updated successfully",
      item: enrichedItem,
    });
  });

  /**
   * Delete item endpoint
   * DELETE /api/items/:id
   */
  deleteItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const sellerId = req.user.userId;

    const result = await ItemService.deleteItem(itemId, sellerId);

    res.status(200).json(result);
  });

  /**
   * Add to favorites
   * POST /api/items/:id/favorite
   */
  addFavorite = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.userId;

    const result = await ItemService.addFavorite(itemId, userId);

    res.status(200).json(result);
  });

  /**
   * Remove from favorites
   * DELETE /api/items/:id/favorite
   */
  removeFavorite = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.userId;

    const result = await ItemService.removeFavorite(itemId, userId);

    res.status(200).json(result);
  });
}

export default new ItemController();
