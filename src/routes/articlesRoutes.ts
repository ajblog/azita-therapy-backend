//@ts-nocheck
import express from "express";
import { addUser, getUsers, loginUser } from "../controllers/userControllers";
import {
  addArticle,
  deleteArticle,
  getArticles,
} from "../controllers/articlesController";
import { authenticateToken } from "../middlewares/authentication";
import { upload } from "../config/multer";

const router = express.Router();

router.get("/articles", getArticles);
router.delete(
  "/articles/:id",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  deleteArticle
); // New POST endpoint for creating users
router.post(
  "/articles/create",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  upload.single("file_address"),
  addArticle
);

export default router;
