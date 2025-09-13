import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create or get chat between two users
 */
export async function createOrGetChat(
  req: Request,
  res: Response
): Promise<void> {
  const { user1Id, user2Id } = req.body;

  if (!user1Id || !user2Id) {
    res.status(400).json({ error: "user1Id and user2Id are required" });
    return;
  }

  try {
    // Check if chat already exists (user1Id-user2Id pair in either order)
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
      include: { messages: true },
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = await prisma.chat.create({
        data: { user1Id, user2Id },
        include: { messages: true },
      });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create or fetch chat" });
  }
}

/**
 * Send a message in a chat
 */
export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { chatId } = req.params;
  const { senderId, message } = req.body;

  if (!senderId || !message) {
    res.status(400).json({ error: "senderId and message are required" });
    return;
  }

  try {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId,
        message,
      },
    });

    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
}

/**
 * Get all messages of a chat
 */
export async function getMessages(req: Request, res: Response): Promise<void> {
  const { chatId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { id: "asc" }, // optional: oldest first
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
