import bcrypt from "bcrypt";
import { bcryptSaltRounds } from "../config/credentials.js";
import UserRepository from "../repositories/UserRepository.js";
import { generateToken } from "../middleware/auth.js";
import { ConflictError, NotFoundError, AuthorizationError } from "../errors/AppError.js";
import { DEFAULT_PROFILE_PICTURE } from "../config/constants.js";
import { validateRegister, validateLogin, validateProfileUpdate } from "../validators/authValidator.js";

/**
 * Authentication Service - Handles business logic for auth
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(email, password, name) {
    // Validate inputs
    validateRegister({ email, password, name });

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

    // Create user
    const user = await UserRepository.create({
      name: name || "User",
      email,
      hashedPassword,
      profilePicture: DEFAULT_PROFILE_PICTURE,
      phone: "",
      bio: "",
      rating: 0,
      reviewCount: 0,
      isActive: true,
    });

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Validate inputs
    validateLogin({ email, password });

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new NotFoundError("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      const reason = user.suspensionReason ? ` - ${user.suspensionReason}` : "";
      throw new AuthorizationError(`Account suspended${reason}`);
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await UserRepository.findByIdWithProfile(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    // Validate inputs
    validateProfileUpdate(profileData);

    // Update user
    const success = await UserRepository.updateProfile(userId, profileData);
    if (!success) {
      throw new NotFoundError("User");
    }

    // Return updated profile
    return this.getProfile(userId);
  }
}

export default new AuthService();
