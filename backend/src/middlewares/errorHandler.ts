import { Request, Response, NextFunction } from "express";

import { config } from "@/config";
import { HttpError, InternalServerError } from "@/lib/customErrors";

// Global error handling middleware
// It must have 4 parameters to be recognized as an error handler by Express
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`
    --- ! Global Error Handler ! ---
    Error Type: ${err.name}
    Error Message: ${err.message}
    Error Stack: ${err.stack}
  `);

  let statusCode = 500;
  let message = "An unexpected server error occurred.";
  let details: any = undefined; // To pass specific field errors or other details

  // Check if the error is an instance of our custom HttpError
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details; // Propagate any specific details (e.g., { field: 'email' })
  } else {
    // For any other unexpected errors that are not HttpError instances
    // Use a generic InternalServerError message and code.
    statusCode = new InternalServerError().statusCode;
    message = new InternalServerError().message;
  }

  // Ensure status code is not 200 if an error occurred (important if status was set earlier)
  if (!res.headersSent) {
    // Check if headers have already been sent
    res.status(statusCode);
  }

  // Send a consistent JSON error response
  res.json({
    ok: false,
    message,
    details, // This will be e.g., { field: "email" } for ConflictError
    // In development, you might send the stack trace for easier debugging.
    // In production, sending the full stack trace is generally not recommended
    // as it can expose sensitive information about your server's internals.
    stack: config.nodeEnv === "production" ? "🥞" : err.stack,
    status: statusCode, // Include the HTTP status code in the response
  });
};
