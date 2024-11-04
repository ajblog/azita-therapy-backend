import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "azita_site_token",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      //@ts-ignore
      req.user = user; // Attach user info to the request
      next();
    }
  );
};
