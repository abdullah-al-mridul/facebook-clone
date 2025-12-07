import { Request, Response } from "express";
import Post from "../models/Post";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

// @desc    Get video feed (Watch)
// @route   GET /api/watch
// @access  Private
export const getWatchFeed = asyncHandler(
  async (req: Request, res: Response) => {
    // Return posts that have a videoUrl or are of type 'video'
    const videos = await Post.find({
      $or: [{ postType: "video" }, { videoUrl: { $exists: true, $ne: "" } }],
    })
      .populate("user", "firstName lastName username profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(new ApiResponse(200, videos, "Watch feed retrieved"));
  }
);
