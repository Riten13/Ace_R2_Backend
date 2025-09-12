import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create or get chat
async function createOrGetChat(req: Request, res: Response): Promise<void> {
  const { user, receiver } = req.body;
  if (!user || !receiver) {
    res.status(400).json({ error: "user and receiver required" });
    return;
  }

  try {
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user, receiver },
          { user: receiver, receiver: user },
        ],
      },
      include: { messages: true },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { user, receiver },
        include: { messages: true },
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create or fetch chat" });
  }
}
async function sendMessage(req: Request, res: Response): Promise<void> {
  const { chatId } = req.params;
  const { userId, message } = req.body;

  if (!userId || !message) {
    res.status(400).json({ error: "userId and message required" });
    return;
  }

  try {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const newMessage = await prisma.message.create({
      data: { chatId: String(chatId), userId, message },
    });

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
}
async function getMessages(req: Request, res: Response): Promise<void> {
  const { chatId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: String(chatId) },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
export { createOrGetChat };

// Send a message
export { sendMessage };

// Get messages of a chat
export { getMessages };
