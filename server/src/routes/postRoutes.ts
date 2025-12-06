import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeedPosts);
router.get("/user/:userId", protect, getUserPosts);
router.put("/:id/like", protect, likePost);
router.delete("/:id", protect, deletePost);

export default router;
