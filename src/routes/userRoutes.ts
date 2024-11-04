import express from "express";
import { addUser, getUsers, loginUser } from "../controllers/userControllers";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users/register", addUser); // New POST endpoint for creating users
router.post("/users/login", loginUser);

export default router;
