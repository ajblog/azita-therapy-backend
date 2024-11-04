import { Router } from "express";
import { addBlogPost, getBlogPosts } from "../controllers/blogControllers";
import { authenticateToken } from "../middlewares/authentication";

const router = Router();

router.get("/posts", getBlogPosts);
router.post(
  "/posts/create",
  //@ts-ignore
  authenticateToken,
  (req, res, next) => {
    //@ts-ignore
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  addBlogPost
);

export default router;
