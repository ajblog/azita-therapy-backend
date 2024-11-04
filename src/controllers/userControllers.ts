import { Request, Response } from "express";
import {
  getAllUsers,
  createUser,
  User,
  findUserByUsername,
  createAccessToken,
} from "../models/userModels";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { username, password, email, role } = req.body;

  // Basic validation
  if (!username || !password || !email) {
    res
      .status(400)
      .json({ message: "Username, password, and email are required" });
  }

  try {
    const newUser: User = { username, password, email, role };
    await createUser(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const hashPassword = async (password: string) => {
  const saltRounds = 10; // You can adjust the salt rounds as needed
  return await bcrypt.hash(password, saltRounds);
};

// Function to verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (!user || !(await verifyPassword(password, user.password))) {
      res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = createAccessToken({
      username: user.username,
      role: user.role,
    });

    res.status(200).json({ access_token: accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};
