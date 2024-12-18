import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import {
  createArticle,
  deleteArticleByQuery,
  getAllArticles,
  getArticleByIdQuery,
  IArticle,
} from "../models/articlesModels";

export const addArticle = async (req: Request, res: Response) => {
  const { name, description, writer, released_date } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Article file is required" });
  }

  const file_address = `/uploads/${req.file.filename}`; // Public file path
  let parsedWriter;
  try {
    parsedWriter = JSON.parse(writer);
  } catch (err) {
    return res.status(400).json({ message: "Invalid writer format" });
  }

  const newPost: IArticle = {
    name,
    description,
    writer: parsedWriter,
    released_date,
    file_address,
  };

  try {
    console.log("name,name,", newPost);
    await createArticle(newPost);
    res.status(201).json({
      message: "Article created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating Article", error });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await getAllArticles();
    // Add server URL to the picture path
    //@ts-ignore
    const articlesWithFullUrl = articles.map((article: IArticle) => ({
      ...article,
      file_address: `${req.protocol}://${req.get("host")}${
        article.file_address
      }`,
    }));
    res.status(200).json(articlesWithFullUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch the post to get the picture file path before deletion
    const articles = (await getArticleByIdQuery(Number(id))) as any[];
    if (articles.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const existingArticle = articles[0];

    // Resolve the full path to the picture file
    const pictureFilename = existingArticle.file_address.split("/uploads/")[1];
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
    const result = await deleteArticleByQuery(Number(id));
    //@ts-ignore
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Articled deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Article blog post", error });
  }
};
