import { Request, Response } from "express";
import Product from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware";

// @desc    Create a new product listing
// @route   POST /api/marketplace
// @access  Private
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, price, description, category, location, images } = req.body;
    const authReq = req as AuthRequest;
    const userId = (authReq.user as any)._id;

    if (!name || !price || !category || !location) {
      throw new ApiError(400, "Please provide all required fields");
    }

    const product = await Product.create({
      seller: userId,
      name,
      price,
      description,
      category,
      location,
      images,
    });

    res
      .status(201)
      .json(new ApiResponse(201, product, "Product listed successfully"));
  }
);

// @desc    Get all products (browse)
// @route   GET /api/marketplace
// @access  Private
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice } = req.query;

  let query: any = { isSold: false }; // Default: show available only

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query)
    .populate("seller", "firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, products, "Products retrieved"));
});

// @desc    Get single product details
// @route   GET /api/marketplace/:id
// @access  Private
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "firstName lastName username profilePicture"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product details retrieved"));
});

// @desc    Mark product as sold
// @route   PUT /api/marketplace/:id/sold
// @access  Private
export const markAsSold = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = (authReq.user as any)._id;
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to update this listing");
  }

  product.isSold = true;
  await product.save();

  res.status(200).json(new ApiResponse(200, product, "Product marked as sold"));
});
