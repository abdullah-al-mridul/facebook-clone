import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  submitVerification,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/verificationController";

const router = express.Router();

router.post("/", protect, submitVerification);
router.get("/", protect, getAllRequests);
router.put("/:id/status", protect, updateRequestStatus);

export default router;
