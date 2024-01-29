import { Request, Response, NextFunction } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).send({
      error: "Please log in first!",
    });
  }
  next();
}
