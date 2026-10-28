import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  searchUsers,
} from "../controllers/chatController.js";
const router = express.Router();
router.use(requireAuth);
router.get("/users", searchUsers);
router.get("/conversations", getConversations);
router.post("/conversations", startConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);
export default router;
