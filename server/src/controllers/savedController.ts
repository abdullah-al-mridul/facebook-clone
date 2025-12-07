import { Request, Response } from "express";
import SavedItem from "../models/SavedItem";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Save an item (post or product)
// @route   POST /api/saved
// @access  Private
export const saveItem = asyncHandler(async (req: Request, res: Response) => {
  const { type, itemId } = req.body;
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;

  if (!type || !itemId) {
    throw new ApiError(400, "Type and itemId are required");
  }

  const query: any = { user: userId, type };
  if (type === "post") query.post = itemId;
  if (type === "product") query.product = itemId;

  const existingItem = await SavedItem.findOne(query);

  if (existingItem) {
    throw new ApiError(400, "Item already saved");
  }

  const savedItem = await SavedItem.create({
    user: userId,
    type,
    post: type === "post" ? itemId : undefined,
    product: type === "product" ? itemId : undefined,
  });

  res
    .status(201)
    .json(new ApiResponse(201, savedItem, "Item saved successfully"));
});

// @desc    Unsave an item
// @route   DELETE /api/saved/:id
// @access  Private
export const unsaveItem = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;

  // We can delete by SavedItem ID directly
  const savedItem = await SavedItem.findById(req.params.id);

  if (!savedItem) {
    throw new ApiError(404, "Saved item not found");
  }

  if (savedItem.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await savedItem.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Item removed from saved"));
});

// @desc    Get all saved items
// @route   GET /api/saved
// @access  Private
// optional: ?type=post or ?type=product
export const getSavedItems = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = (authReq.user as any)._id;
    const { type } = req.query;

    const query: any = { user: userId };
    if (type) query.type = type;

    const savedItems = await SavedItem.find(query)
      .populate("post")
      .populate({
        path: "post",
        populate: { path: "user", select: "firstName lastName profilePicture" },
      })
      .populate("product")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(new ApiResponse(200, savedItems, "Saved items retrieved"));
  }
);
