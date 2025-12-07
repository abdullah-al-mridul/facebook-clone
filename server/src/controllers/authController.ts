import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/authMiddleware";
import { sendEmail } from "../utils/sendEmail";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
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
      dateOfBirth, // Provided but not used in model yet, can be added later
    } = req.body;

    if (!firstName || !lastName || !email || !password /*|| !username*/) {
      // Username might be optional or auto-generated? user controller logic suggests it is required.
      throw new ApiError(400, "Please add all required fields");
    }

    // Default username if not provided (e.g. from simple register form)
    const finalUsername =
      username || email.split("@")[0] + Math.floor(Math.random() * 1000);

    const userExists = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });

    if (userExists) {
      throw new ApiError(
        400,
        "User already exists with this email or username"
      );
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      username: finalUsername,
      otp,
      otpExpires,
      isEmailVerified: false,
    });

    if (user) {
      // Send OTP via Email
      const emailText = `Your confirmation code is ${otp}. It will expire in 10 minutes.`;
      await sendEmail({
        to: user.email,
        subject: "Verify your email - Facemusk",
        text: emailText,
        html: `<p>Your confirmation code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
      });

      res.status(201).json(
        new ApiResponse(
          201,
          {
            _id: (user as any)._id,
            email: user.email,
            // Do NOT send token yet
          },
          "User registered. Please check your email for verification code."
        )
      );
    } else {
      throw new ApiError(400, "Invalid user data");
    }
  }
);

// @desc    Verify Email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.isEmailVerified) {
    // If already verified, just return token (or error?)
    // Let's return token to allow login
    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: (user as any)._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          token: generateToken((user as any)._id),
        },
        "Email already verified. Logged in."
      )
    );
    return;
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: (user as any)._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        token: generateToken((user as any)._id),
      },
      "Email verified successfully. Logged in."
    )
  );
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-code
// @access  Public
export const resendCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const emailText = `Your new confirmation code is ${otp}. It will expire in 10 minutes.`;
  await sendEmail({
    to: user.email,
    subject: "Resend Code - Facemusk",
    text: emailText,
    html: `<p>Your new confirmation code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  });

  res.status(200).json(new ApiResponse(200, null, "Verification code resent"));
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check verification
    if (!user.isEmailVerified) {
      throw new ApiError(401, "Please verify your email first.");
      // Optionally, could return specific code to trigger frontend verify flow
    }

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
