import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ----------------- Get High EQ Users -----------------
export const getHighEQUsers = async (req: Request, res: Response) => {
  try {
    // Adjust the threshold for "high" EQ if needed
    const highEQUsers = await prisma.user.findMany({
      where: {
        eqScore: {
          gte: 80, // EQ score >= 80 is considered high
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        photoURL: true,
        eqScore: true,
        eqLevel: true,
        role: true,
        avgSentiment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(highEQUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch high EQ users" });
  }
};
