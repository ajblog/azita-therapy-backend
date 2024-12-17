import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  createBlogPost,
  BlogPost,
  getAllBlogPosts,
  removeBlogPostById,
  updateBlogPostById,
  getBlogPostByIdQuery,
} from "../models/blogModels";

export const addBlogPost = async (req: Request, res: Response) => {
  const { title, description, content } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Picture is required" });
  }

  const picture = `/uploads/${req.file.filename}`; // Public file path
  const newPost: BlogPost = { title, description, content, picture };

  try {
    await createBlogPost(newPost);
    res.status(201).json({
      message: "Blog post created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error });
  }
};

export const getBlogPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const posts = await getBlogPostByIdQuery(Number(id));
    // Add server URL to the picture path
    //@ts-ignore
    const postsWithFullUrls = posts.map((post: any) => ({
      ...post,
      picture: `${req.protocol}://${req.get("host")}${post.picture}`,
    }));
    res.status(200).json(postsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts", error });
  }
};

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllBlogPosts();
    // Add server URL to the picture path
    //@ts-ignore
    const postsWithFullUrls = posts.map((post: any) => ({
      ...post,
      picture: `${req.protocol}://${req.get("host")}${post.picture}`,
    }));
    res.status(200).json(postsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts", error });
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch the post to get the picture file path before deletion
    const posts = (await getBlogPostByIdQuery(Number(id))) as any[];
    if (posts.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const existingPost = posts[0];

    // Resolve the full path to the picture file
    const pictureFilename = existingPost.picture.split("/uploads/")[1];
    const picturePath = path.join(
      __dirname,
      "../..",
      "uploads",
      pictureFilename
    );

    // Delete the image file from the filesystem
    fs.unlink(picturePath, (err) => {
      if (err) {
        console.log("Error deleting picture:", err);
      } else {
        console.log("Picture deleted:", picturePath);
      }
    });

    // Now delete the blog post from the database
    const result = await removeBlogPostById(Number(id));
    //@ts-ignore
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post", error });
  }
};

export const updateBlogPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, content } = req.body;

  try {
    // Fetch the current post data from the database
    const posts = (await getBlogPostByIdQuery(Number(id))) as any[];
    if (posts.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Retrieve the existing post data
    const existingPost = posts[0];

    // If the picture is being replaced, delete the old one
    let newPicture = existingPost.picture;
    if (req.file) {
      const oldPictureFilename = existingPost.picture.split("/uploads/")[1];
      const oldPicturePath = path.join(
        __dirname,
        "../..",
        "uploads",
        oldPictureFilename
      );

      // Delete the old image if a new one is uploaded
      fs.unlink(oldPicturePath, (err) => {
        if (err) {
          console.log("Error deleting old picture", err);
        }
      });

      newPicture = `/uploads/${req.file.filename}`;
    }

    // Update the post data with the new values, but keep the old ones if not provided
    const updatedPost = {
      title: title || existingPost.title,
      description: description || existingPost.description,
      content: content || existingPost.content,
      picture: newPicture,
    };

    // Call the model function to update the blog post in the database
    const result = await updateBlogPostById(Number(id), updatedPost);

    // Check if the post was updated
    //@ts-ignore
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog post", error });
  }
};
