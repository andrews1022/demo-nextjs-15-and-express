import { Request, Response, NextFunction } from "express";

import { config } from "@/config";
import { UnauthorizedError, ForbiddenError } from "@/lib/customErrors";
import { verifyToken } from "@/lib/jwt";

// augment the express request type to include a 'user' property
// this allows us to attach user information to the request object
// and for typescript to recognize it in subsequent middleware/route handlers
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // the userId extracted from the jwt payload
        // add other properties from your JwtPayload if they are always present
        // e.g., email?: string;
      };
    }
  }
}

// middleware to authenticate requests using jwt from an HttpOnly cookie
// it expects the jwt in the 'jwt' cookie
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[config.jwtName];

  if (!token) {
    // if no token is provided, the user is unauthorized
    throw new UnauthorizedError("Authentication token is required.");
  }

  try {
    // verify the token using your utility function
    const decodedPayload = await verifyToken(token);

    // attach the decoded user information to the request object
    // this makes the user's id available in subsequent route handlers
    if (typeof decodedPayload.userId !== "string") {
      throw new ForbiddenError("Invalid token payload: userId is missing or not a string.");
    }
    req.user = { id: decodedPayload.userId };

    // proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    // if verification fails (e.g., token expired, invalid signature)
    // throw a ForbiddenError (403) as the token is invalid/expired, not just missing
    console.error("Token authentication failed:", error.message);
    throw new ForbiddenError("Invalid or expired authentication token.");
  }
};
