import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getDashboardStats } from "../controllers/analyticsController";

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);

export default router;
