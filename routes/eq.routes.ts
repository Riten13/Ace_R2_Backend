import {
  addEQ,
  addMood,
  chatWithAI,
  checkIfMoodAddedToday,
  trackActivity,
} from "../controllers/eq.controller.ts";
import { Router } from "express";

// Create a router.
const router = Router();

// Default route to check if auth routes are accessible.
router.get("/", (_, res) => {
  res.status(200).send({ data: "Auth Route" });
});

// ---------------------------------------------------------------------
// EQ ROUTES

// Add EQ details of the user in the database.
router.post("/addEQ", addEQ);

// Add EQ details of the user in the database.
router.post("/chat-with-ai", chatWithAI);

// Check if mood was added today
router.post("/check-if-mood-exists", checkIfMoodAddedToday);

// Add Mood for today
router.post("/add-mood", addMood);

// Add Mood for today
router.post("/track-activity", trackActivity);

// ---------------------------------------------------------------------

export default router;
