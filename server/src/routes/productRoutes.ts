import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  markAsSold,
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.put("/:id/sold", protect, markAsSold);

export default router;
