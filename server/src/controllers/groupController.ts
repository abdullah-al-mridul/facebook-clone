import { Request, Response } from "express";
import Group from "../models/Group";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware";

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, privacy } = req.body;
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;

  if (!name) {
    throw new ApiError(400, "Group name is required");
  }

  let coverUrl = "";
  if (req.file) {
    coverUrl = await uploadToCloudinary(req.file.buffer, "groups");
  }

  const group = await Group.create({
    name,
    description,
    privacy,
    coverUrl,
    createdBy: userId,
    admins: [userId],
    members: [userId],
  });

  res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully"));
});

// @desc    Get all groups (or search)
// @route   GET /api/groups
// @access  Private
export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  // Basic implementation: get all public groups
  // Can be enhanced with search query
  const groups = await Group.find({ privacy: "public" })
    .populate("members", "firstName lastName profilePicture") // Just to show member count usually
    .sort({ members: -1 }); // Popular groups first

  res.status(200).json(new ApiResponse(200, groups, "Groups retrieved"));
});

// @desc    Get single group details
// @route   GET /api/groups/:id
// @access  Private
export const getGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
    .populate("members", "firstName lastName username profilePicture")
    .populate("admins", "firstName lastName username profilePicture");

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  res.status(200).json(new ApiResponse(200, group, "Group retrieved"));
});

// @desc    Join a group
// @route   POST /api/groups/:id/join
// @access  Private
export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (group.members.includes(userId)) {
    throw new ApiError(400, "Already a member of this group");
  }

  group.members.push(userId);
  await group.save();

  res.status(200).json(new ApiResponse(200, null, "Joined group successfully"));
});

// @desc    Leave a group
// @route   POST /api/groups/:id/leave
// @access  Private
export const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (!group.members.includes(userId)) {
    throw new ApiError(400, "Not a member of this group");
  }

  // Filter out the user
  group.members = group.members.filter(
    (id) => id.toString() !== userId.toString()
  );
  group.admins = group.admins.filter(
    (id) => id.toString() !== userId.toString()
  ); // Also remove admin if they leave

  await group.save();

  res.status(200).json(new ApiResponse(200, null, "Left group successfully"));
});
