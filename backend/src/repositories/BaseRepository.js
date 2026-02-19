import { DatabaseError } from "../errors/AppError.js";

/**
 * Base Repository Class - Common CRUD operations for Mongoose
 */
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new DatabaseError(`Failed to find by ID: ${error.message}`);
    }
  }

  async findOne(filter) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw new DatabaseError(`Failed to find one: ${error.message}`);
    }
  }

  async findMany(filter = {}, options = {}) {
    try {
      let query = this.model.find(filter);

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.sort) {
        query = query.sort(options.sort);
      }

      return await query.exec();
    } catch (error) {
      throw new DatabaseError(`Failed to find many: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      throw new DatabaseError(`Failed to create: ${error.message}`);
    }
  }

  async updateById(id, updates) {
    try {
      const result = await this.model.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
      return result ? true : false;
    } catch (error) {
      throw new DatabaseError(`Failed to update: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result ? true : false;
    } catch (error) {
      throw new DatabaseError(`Failed to delete: ${error.message}`);
    }
  }

  async deleteMany(filter) {
    try {
      const result = await this.model.deleteMany(filter);
      return result.deletedCount;
    } catch (error) {
      throw new DatabaseError(`Failed to delete many: ${error.message}`);
    }
  }

  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new DatabaseError(`Failed to count: ${error.message}`);
    }
  }

  async paginate(filter = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const items = await this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.model.countDocuments(filter);

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
      throw new DatabaseError(`Failed to paginate: ${error.message}`);
    }
  }
}

export default BaseRepository;
