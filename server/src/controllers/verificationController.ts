import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import VerificationRequest from "../models/VerificationRequest";
import User from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";

// @desc    Submit a verification request
// @route   POST /api/verification
// @access  Private
export const submitVerification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { fullName, dob, country, address, documentType, documentUrl } =
      req.body;

    if (
      !fullName ||
      !dob ||
      !country ||
      !address ||
      !documentType ||
      !documentUrl
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingRequest = await VerificationRequest.findOne({
      user: req.user?._id,
      status: "Pending",
    });

    if (existingRequest) {
      throw new ApiError(
        400,
        "You already have a pending verification request"
      );
    }

    const verificationRequest = await VerificationRequest.create({
      user: req.user?._id,
      fullName,
      dob,
      country,
      address,
      documentType,
      documentUrl,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          verificationRequest,
          "Verification request submitted"
        )
      );
  }
);

// @desc    Get all verification requests
// @route   GET /api/verification
// @access  Private (Admin only - simplified to Private for now)
export const getAllRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const requests = await VerificationRequest.find().populate(
      "user",
      "firstName lastName profilePicture email"
    );
    res
      .status(200)
      .json(new ApiResponse(200, requests, "Verification requests retrieved"));
  }
);

// @desc    Update verification request status
// @route   PUT /api/verification/:id/status
// @access  Private (Admin only)
export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Approved", "Denied"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const request = await VerificationRequest.findById(id);

    if (!request) {
      throw new ApiError(404, "Verification request not found");
    }

    request.status = status;
    await request.save();

    if (status === "Approved") {
      await User.findByIdAndUpdate(request.user, { isVerified: true });
    }

    res
      .status(200)
      .json(new ApiResponse(200, request, `Verification request ${status}`));
  }
);
