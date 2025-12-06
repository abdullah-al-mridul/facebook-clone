import express from "express";
import {
  accessConversation,
  fetchConversations,
  sendMessage,
  allMessages,
} from "../controllers/chatController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, accessConversation);
router.get("/", protect, fetchConversations);
router.post("/message", protect, sendMessage);
router.get("/message/:conversationId", protect, allMessages);

export default router;
