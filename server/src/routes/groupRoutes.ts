import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
} from "../controllers/groupController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getGroups);
router.get("/:id", protect, getGroup);
router.post("/:id/join", protect, joinGroup);
router.post("/:id/leave", protect, leaveGroup);

export default router;
