import { db } from "../config/db";

export interface BlogPost {
  title: string;
  description: string;
  content: string;
}

export const createBlogPost = async (post: BlogPost) => {
  const { title, description, content } = post;
  const [result] = await db.query(
    "INSERT INTO blogPosts (title, description, content) VALUES (?, ?, ?)",
    [title, description, content]
  );
  return result;
};

export const getAllBlogPosts = async () => {
  const [rows] = await db.query("SELECT * FROM blogPosts");
  return rows;
};
