import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

export const getAllUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  res.status(200).json({
    message: "All users retrieved successfully",
    currentUserRole: user.role,
  });
  next();
};
