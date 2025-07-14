import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "@/middlewares/errorHandler";
import { userRouter } from "@/routes/userRouter";

const app = express();

// --- Global Middleware ---
app.use(helmet()); // security headers
app.use(cors()); // allow cross-origin requests (from client, server ok)
app.use(morgan("dev")); // request logger
app.use(express.json()); // parse JSON bodies

// Basic root API route
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express API!" });
});

// --- API Routes ---
// Mount specific route modules here
app.use("/api/users", userRouter);

// --- Error Handling Middleware ---
// This must be the LAST middleware mounted, after all routes and other middleware.
app.use(errorHandler);

// Export the configured Express application instance
export default app;
