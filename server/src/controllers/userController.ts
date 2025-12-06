import { Request, Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User profile retrieved"));
  }
);

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;

    if (req.params.id !== (authReq.user as any)._id.toString()) {
      throw new ApiError(401, "Not authorized to update this profile");
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(new ApiResponse(200, user, "User profile updated"));
  }
);

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const users = await User.find({
    $or: [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { username: { $regex: q, $options: "i" } },
    ],
  } as any).select("firstName lastName username profilePicture");

  res.status(200).json(new ApiResponse(200, users, "Search results"));
});

// @desc    Send friend request
// @route   POST /api/users/friend-request/:id
// @access  Private
export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const targetUserId = req.params.id;
    const currentUserId = (authReq.user as any)._id;

    if (targetUserId === currentUserId.toString()) {
      throw new ApiError(400, "Cannot send friend request to yourself");
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      throw new ApiError(404, "User not found");
    }

    if (targetUser.friendRequests.includes(currentUserId)) {
      throw new ApiError(400, "Friend request already sent");
    }

    if (targetUser.friends.includes(currentUserId)) {
      throw new ApiError(400, "Already friends");
    }

    targetUser.friendRequests.push(currentUserId);
    await targetUser.save();

    res.status(200).json(new ApiResponse(200, null, "Friend request sent"));
  }
);

// @desc    Accept friend request
// @route   POST /api/users/friend-request/accept/:id
// @access  Private
export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const requesterId = req.params.id;
    const currentUserId = (authReq.user as any)._id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!currentUser || !requester) {
      throw new ApiError(404, "User not found");
    }

    if (!currentUser.friendRequests.includes(requesterId as any)) {
      throw new ApiError(400, "No friend request from this user");
    }

    // Add to friends list
    currentUser.friends.push(requesterId as any);
    requester.friends.push(currentUserId);

    // Remove from requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await currentUser.save();
    await requester.save();

    res.status(200).json(new ApiResponse(200, null, "Friend request accepted"));
  }
);

// @desc    Reject friend request
// @route   POST /api/users/friend-request/reject/:id
// @access  Private
export const rejectFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const requesterId = req.params.id;
    const currentUserId = (authReq.user as any)._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await currentUser.save();

    res.status(200).json(new ApiResponse(200, null, "Friend request rejected"));
  }
);
