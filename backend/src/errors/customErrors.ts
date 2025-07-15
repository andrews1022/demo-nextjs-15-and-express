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
