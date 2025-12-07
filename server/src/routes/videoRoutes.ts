import express from "express";
import { getWatchFeed } from "../controllers/videoController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getWatchFeed);

export default router;
