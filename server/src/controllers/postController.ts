import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { content, privacy, group } = req.body;
  const authReq = req as AuthRequest;

  let images: string[] = [];
  let videoUrl: string = "";
  let postType: "text" | "image" | "video" = "text";

  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      if (file.mimetype.startsWith("image/")) {
        const url = await uploadToCloudinary(
          (file as Express.Multer.File).buffer,
          "posts"
        );
        images.push(url);
        postType = "image";
      } else if (file.mimetype.startsWith("video/")) {
        const url = await uploadToCloudinary(
          (file as Express.Multer.File).buffer,
          "videos"
        );
        videoUrl = url;
        postType = "video";
      }
    }
  }

  if (!content && images.length === 0 && !videoUrl) {
    throw new ApiError(400, "Post content or media is required");
  }

  const post = await Post.create({
    user: (authReq.user as any)._id,
    content,
    images,
    videoUrl,
    postType,
    privacy,
    group: group || undefined,
  });

  const populatedPost = await Post.findById(post._id).populate(
    "user",
    "firstName lastName username profilePicture"
  );

  res
    .status(201)
    .json(new ApiResponse(201, populatedPost, "Post created successfully"));
});

// @desc    Get all posts (News Feed)
// @route   GET /api/posts/feed
// @access  Private
export const getFeedPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    // For now, get all public posts or posts from friends (simplified)
    // In a real app, this would be more complex
    const posts = await Post.find({})
      .populate("user", "firstName lastName username profilePicture")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(new ApiResponse(200, posts, "Feed retrieved successfully"));
  }
);

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "firstName lastName username profilePicture")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(new ApiResponse(200, posts, "User posts retrieved successfully"));
  }
);

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, post.likes, "Post like status updated"));
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  const authReq = req as AuthRequest;

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.user.toString() !== (authReq.user as any)._id.toString()) {
    throw new ApiError(401, "User not authorized");
  }

  await post.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});
