import { BaseRepository } from "./BaseRepository.js";
import { User } from "../models/User.js";

/**
 * User Repository - Handles all user data access
 */
export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByIdWithProfile(userId) {
    return this.model.findById(userId).select("-hashedPassword");
  }

  async updateProfile(userId, profileData) {
    return this.updateById(userId, profileData);
  }

  async incrementRating(userId, points = 1) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          $inc: { rating: points, reviewCount: 1 },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to increment rating: ${error.message}`);
    }
  }
}

export default new UserRepository();
