//@ts-nocheck
import { Router } from "express";
import {
  addBlogPost,
  getBlogPosts,
  deleteBlogPost,
  updateBlogPost,
  getBlogPostById,
} from "../controllers/blogControllers";
import { authenticateToken } from "../middlewares/authentication";
import { upload } from "../config/multer";

const router = Router();

router.get("/posts", getBlogPosts);

router.get("/posts/:id", getBlogPostById);

router.post(
  "/posts/create",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  upload.single("picture"),
  addBlogPost
);

router.delete(
  "/posts/:id",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  deleteBlogPost
);

router.put(
  "/posts/:id",
  //@ts-ignore
  authenticateToken,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  upload.single("picture"),
  updateBlogPost
);

export default router;
