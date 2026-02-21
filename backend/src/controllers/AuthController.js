import AuthService from "../services/AuthService.js";
import { asyncHandler } from "../errors/errorHandler.js";

/**
 * Authentication Controller - Handles HTTP requests for auth
 */
export class AuthController {
  /**
   * Register endpoint
   * POST /api/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    const result = await AuthService.register(email, password, name);

    res.status(201).json(result);
  });

  /**
   * Login endpoint
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json(result);
  });

  /**
   * Get profile endpoint
   * GET /api/auth/profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const profile = await AuthService.getProfile(userId);

    res.status(200).json(profile);
  });

  /**
   * Update profile endpoint
   * PUT /api/auth/profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const updatedProfile = await AuthService.updateProfile(userId, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  });
}

export default new AuthController();
