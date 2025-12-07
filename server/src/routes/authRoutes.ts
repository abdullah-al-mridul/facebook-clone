import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  resendCode,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.get("/me", protect, getMe);

export default router;
