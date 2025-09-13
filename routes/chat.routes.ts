import { Router } from "express";
import { prisma } from "../utils/primsaClient.ts";
import {
  createOrGetChat,
  sendMessage,
  getMessages,
} from "../controllers/chat.controller.ts";

const router = Router();

// Create or get a chat between two users
router.post("/create-chat", createOrGetChat);

// Get all messages for a chat
router.get("/chats/:chatId/messages", getMessages);

// Send a message to a chat
router.post("/chats/:chatId/messages", sendMessage);

// (Extra) Get all chats of a user
router.get("/chats/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: { messages: { orderBy: { id: "desc" }, take: 1 } }, // latest msg
    });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

export default router;
