import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      gender,
      dateOfBirth,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !username) {
      throw new ApiError(400, "Please add all fields");
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      username,
      // Add other fields as needed
    });

    if (user) {
      res.status(201).json(
        new ApiResponse(
          201,
          {
            _id: (user as any)._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            token: generateToken((user as any)._id),
          },
          "User registered successfully"
        )
      );
    } else {
      throw new ApiError(400, "Invalid user data");
    }
  }
);

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(
      new ApiResponse(
        200,
        {
          _id: (user as any)._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
          token: generateToken((user as any)._id),
        },
        "User logged in successfully"
      )
    );
  } else {
    throw new ApiError(401, "Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const user = await User.findById((authReq.user as any)._id).select(
    "-password"
  );

  res.status(200).json(new ApiResponse(200, user, "User data retrieved"));
});
