import { db } from "../config/db";
import jwt from "jsonwebtoken";
import { hashPassword } from "../controllers/userControllers";

export interface User {
  username: string;
  password: string;
  email: string;
  role?: string;
}

export const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, username, email, role, created_at, updated_at FROM users"
  );
  return rows;
};

export const createUser = async (user: User) => {
  const { username, password, email, role } = user;
  const hashedPassword = await hashPassword(password); // 10 is the salt rounds

  const [result] = await db.query(
    "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
    [username, hashedPassword, email, role || "user"] // default role as 'user' if not provided
  );
  return result;
};

export const findUserByUsername = async (username: string) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  //@ts-ignore
  return rows[0]; // Return the first user found
};

export const createAccessToken = (user: {
  username: string;
  role?: string;
}) => {
  return jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET || "azita_site_token", // Replace with your secret
    { expiresIn: "48h" } // Token will expire in 1 hour
  );
};
