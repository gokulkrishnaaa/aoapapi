import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireCandidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser.role || req.currentUser.role != "candidate") {
    throw new NotAuthorizedError();
  }

  next();
};
