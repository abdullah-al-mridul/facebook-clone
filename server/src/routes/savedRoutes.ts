import express from "express";
import {
  saveItem,
  unsaveItem,
  getSavedItems,
} from "../controllers/savedController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, saveItem);
router.delete("/:id", protect, unsaveItem);
router.get("/", protect, getSavedItems);

export default router;
