// Base custom error class for HTTP-related errors.
// All other custom errors will extend this.
export class HttpError extends Error {
  public statusCode: number;
  public details?: any; // Optional field for more specific error data (e.g., { field: 'email' })

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = this.constructor.name; // Set error name to class name
    this.statusCode = statusCode;
    this.details = details;

    // Capture stack trace (V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error for 400 Bad Request
// Used when client sends invalid input (e.g., missing fields, invalid format)
export class BadRequestError extends HttpError {
  constructor(message: string = "Bad Request", details?: any) {
    super(message, 400, details);
  }
}

// Error for 409 Conflict
// Used when a request conflicts with the current state of the server (e.g., unique constraint violation)
export class ConflictError extends HttpError {
  constructor(message: string = "Conflict", details?: any) {
    super(message, 409, details);
  }
}

// Error for 500 Internal Server Error
// Used for unexpected errors on the server side
export class InternalServerError extends HttpError {
  constructor(message: string = "Internal Server Error", details?: any) {
    super(message, 500, details);
  }
}

// Error for 404 Not Found
// Used when a requested resource cannot be found
export class NotFoundError extends HttpError {
  constructor(message: string = "Not Found", details?: any) {
    super(message, 404, details);
  }
}

// Error for 401 Unauthorized
// Used when authentication is required and has failed or has not yet been provided.
export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized", details?: any) {
    super(message, 401, details);
  }
}

// Error for 403 Forbidden
// Used when the server understands the request but refuses to authorize it.
export class ForbiddenError extends HttpError {
  constructor(message: string = "Forbidden", details?: any) {
    super(message, 403, details);
  }
}
