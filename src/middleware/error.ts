import { Request, Response, NextFunction } from "express";

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    error: {
      message: err.message,
    },
  });
};

export { errorHandler };
