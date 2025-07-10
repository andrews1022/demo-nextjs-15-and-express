import { Request, Response, NextFunction } from "express";

import { config } from "@/config";

// Global error handling middleware.
// It must have 4 parameters to be recognized as an error handler by Express.
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err.stack); // Log the full error stack for debugging

  // Set a default status code (e.g., 500 Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a user-friendly error response (avoid exposing sensitive error details in production)
  res.json({
    message: err.message,
    // In development, you might send the stack trace for debugging:
    stack: config.nodeEnv === "production" ? "🥞" : err.stack,
  });
};
