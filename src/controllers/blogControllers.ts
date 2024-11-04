import { Request, Response } from "express";
import {
  createBlogPost,
  BlogPost,
  getAllBlogPosts,
} from "../models/blogModels";

export const addBlogPost = async (req: Request, res: Response) => {
  const { title, description, content } = req.body;

  if (!title || !description || !content) {
    res
      .status(400)
      .json({ message: "Title, description, and content are required" });
  }

  const newPost: BlogPost = { title, description, content };

  try {
    await createBlogPost(newPost);
    res.status(201).json({
      message: "Blog post created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error });
  }
};

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllBlogPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts", error });
  }
};
