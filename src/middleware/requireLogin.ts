import { Request, Response, NextFunction } from "express";

// Assuming User type is something like this
type User = {
  id: string;
  googleId:   string;
  displayName: string
};

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).send({
      error: "Please log in first!",
    });
  }

  // Ensure req.user is correctly typed as User
  const user = req.user as User;
  console.log(user.id)
  next(user.id);
}
