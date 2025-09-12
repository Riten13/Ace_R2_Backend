import { prisma } from "../utils/primsaClient.ts";
import { Request, Response } from "express";
import axios from "axios";

// Update the EQ details of the user in the database.
export const addEQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseUID = req.body?.firebaseUID;

    function calcScore(arr: number[]) {
      const total = arr.reduce((sum, val) => sum + val, 0);
      const eqScore = Math.round((total / (arr.length * 5)) * 100);

      return eqScore;
    }

    const user = await prisma.user.findUnique({
      where: {
        firebaseUID: firebaseUID,
      },
    });

    if (!user) {
      res.status(404).send({ data: "User not found." });
      return;
    }

    const answers = req?.body?.answers as number[];

    const eqScore = calcScore(answers);

    let eqLevel = "";

    if (eqScore < 50) {
      eqLevel = "Needs Improvement";
    } else if (eqScore >= 50 && eqScore < 80) {
      eqLevel = "Average";
    } else if (eqScore >= 80 && eqScore < 100) {
      eqLevel = "High";
    }

    const updatedUser = await prisma.user.update({
      where: {
        firebaseUID: firebaseUID,
      },
      data: {
        eqLevel: eqLevel,
        eqScore: eqScore,
      },
    });

    res.status(200).send({ user: updatedUser });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Chat with AI
export const chatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      message,
      history = [],
      firebaseUID,
    } = req.body as {
      message: string;
      firebaseUID: string;
      history?: { role: "user" | "model"; text: string }[];
    };

    if (!message) {
      res.status(400).json({ reply: "Message is required.", sentiment: 5 });
      return;
    }

    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `You are an **emotional wellness coach**.
                  Your role:
                  - Analyze the user's emotions and mental state.
                  - Respond with empathy, kindness, and encouragement.
                  - Guide them gently toward positive reflection and healthy coping strategies.
                  - Keep replies short, supportive, and conversational (3–5 sentences).
                  
                  ⚠️ Important:
                  Always respond ONLY in **valid JSON** with exactly two keys:
                  
                  {
                    "reply": "An empathetic response here.",
                    "sentiment": <number 1-10, 1 = extremely negative, 10 = extremely positive>
                  }
                  
                  Do not include anything outside this JSON object. No markdown, no explanations, no extra text.`,
        },
      ],
    };

    const contents = [
      systemPrompt,
      ...history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent",
      { contents },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_KEY as string,
        },
      }
    );

    // Get raw reply from Gemini
    let rawReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '{"reply":"Sorry, I didn’t quite get that.","sentiment":5}';

    // console.log("Raw model reply:", response);
    // console.log("Parsed response:", parsed);

    console.log(rawReply);

    // Safely parse JSON
    let parsed;
    try {
      let JSONtext = rawReply.replace("json", "").replaceAll("`", "");
      parsed = JSON.parse(JSONtext);

      console.log(parsed);
    } catch (err) {
      console.error("❌ Invalid JSON from model, falling back:", err);
      parsed = { reply: rawReply, sentiment: 5 };
    }

    // Optional: Update avgSentiment in DB
    const user = await prisma.user.findUnique({
      where: { firebaseUID },
      select: { avgSentiment: true },
    });
    const newAvgSentiment = (user?.avgSentiment || 5 + parsed.sentiment) / 2;

    await prisma.user.update({
      where: { firebaseUID },
      data: { avgSentiment: newAvgSentiment },
    });

    res.status(200).send({ data: parsed });

    return;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      reply: "⚠️ Error connecting to Gemini. Please try again.",
      sentiment: 5,
    });
  }
};

// Check if mood was added today - if yes, disable the option to add mood again.
export const checkIfMoodAddedToday = async (req: Request, res: Response) => {
  try {
    const firebaseUID = req.body?.firebaseUID;

    const user = await prisma.user.findUnique({
      where: {
        firebaseUID: firebaseUID,
      },
    });

    if (!user) {
      res.status(404).send({ data: "User not found." });
      return;
    }

    const moods = await prisma.mood.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    if (moods) {
      res.status(200).send({ moodAdded: true });
    } else {
      res.status(200).send({ moodAdded: false });
    }

    return;
  } catch (error) {
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};

// Add mood entry for the user. (for specific day)
export const addMood = async (req: Request, res: Response) => {
  try {
    const firebaseUID = req.body?.firebaseUID;
    const mood = req.body?.mood as string;
    const moodValue = req.body?.moodValue as number;
    if (!mood || !moodValue) {
      res.status(400).send({ data: "Mood and moodValue are required." });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        firebaseUID: firebaseUID,
      },
    });

    if (!user) {
      res.status(404).send({ data: "User not found." });
      return;
    }

    const newMood = await prisma.mood.create({
      data: {
        userId: user.id,
        mood: mood,
        moodValue: moodValue,
      },
    });

    res.status(200).send({ mood: newMood });
    return;
  } catch (error) {
    res.status(500).send({ data: "Something went wrong." });
    return;
  }
};
