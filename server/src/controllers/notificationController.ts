import { Request, Response } from "express";
import Notification from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = (authReq.user as any)._id;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    res
      .status(200)
      .json(new ApiResponse(200, notifications, "Notifications retrieved"));
  }
);

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  notification.isRead = true;
  await notification.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Notification marked as read"));
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = (authReq.user as any)._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, null, "All notifications marked as read"));
  }
);
