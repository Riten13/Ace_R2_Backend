import http from "http";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
dotenv.config();

// Importing Routes ----------------------------------------------------------------------------------------------

import userRouter from "./routes/user.routes.ts";
import eqRouter from "./routes/eq.routes.ts";

// Initializing Server -------------------------------------------------------------------------------------------

const app = express();
let server = http.createServer(app);

// Using Middleware -------------------------------------------------------------------------------------------

// Whitelist for domains from which requests should be allowed
const whitelist = ["http://localhost:3000"];

// Function to deny access to domains except those in whitelist.
const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Find request domain and check in whitelist.
    if (origin && whitelist.indexOf(origin) !== -1) {
      // Accept request
      callback(null, true);
    } else {
      // Send CORS error.
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // Limit each IP to 50 requests per minute
});

// Rate Limit
app.use(limiter);
// Parses request body.
app.use(express.urlencoded({ extended: true }));
// Parses JSON passed inside body.
app.use(express.json());
// Enable CORS
app.use(cors(corsOptions));
// Add security to server.
app.use(helmet());
// Removes the "X-Powered-By" HTTP header from Express responses.
app.disable("x-powered-by");

// Routes -------------------------------------------------------------------------------------------

// Default route to check if server is working.
app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).send("We are good to go!");
});

// Routes -----------------------------------------------------------------------------------------

// Auth Routes
app.use("/api/v1/user", userRouter);
// EQ Routes
app.use("/api/v1/eq", eqRouter);

// Listening on PORT -------------------------------------------------------------------------------------------

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
