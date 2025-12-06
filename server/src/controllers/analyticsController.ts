import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Post from "../models/Post";
import User from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    // 1. Post Reach (Total views on user's posts)
    const posts = await Post.find({ user: userId });
    const totalReach = posts.reduce((acc, post) => acc + (post.views || 0), 0);

    // 2. Post Engagement (Total likes + comments + shares)
    const totalEngagement = posts.reduce(
      (acc, post) =>
        acc + post.likes.length + post.comments.length + (post.shares || 0),
      0
    );

    // 3. New Followers (Friends added in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Note: This is an approximation since we don't track "when" a friend was added in the simple array.
    // Ideally, we should have a Friendship model with createdAt.
    // For now, we'll just return the total friend count as a placeholder or 0 if no timestamp available.
    const user = await User.findById(userId);
    const newFollowers = user?.friends.length || 0;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          reach: totalReach,
          engagement: totalEngagement,
          newFollowers: newFollowers,
        },
        "Dashboard stats retrieved"
      )
    );
  }
);
