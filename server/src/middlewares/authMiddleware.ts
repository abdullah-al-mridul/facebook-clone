import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
        };

        (req as any).user = (await User.findById(decoded.id).select(
          "-password"
        )) as IUser;
        next();
      } catch (error) {
        throw new ApiError(401, "Not authorized, token failed");
      }
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, no token");
    }
  }
);
