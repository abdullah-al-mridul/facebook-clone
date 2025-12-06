import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/search", protect, searchUsers); // Must be before /:id
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.post("/friend-request/:id", protect, sendFriendRequest);
router.post("/friend-request/accept/:id", protect, acceptFriendRequest);
router.post("/friend-request/reject/:id", protect, rejectFriendRequest);

export default router;
