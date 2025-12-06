import express from "express";
import { addComment, deleteComment } from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:postId", protect, addComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
