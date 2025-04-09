// Add your middleware in this file
import { NextFunction, Request, Response } from "express";

export const defaultMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware");
  next();
};
