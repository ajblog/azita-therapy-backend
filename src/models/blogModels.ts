import { db } from "../config/db";

export interface BlogPost {
  title: string;
  description: string;
  content: string;
  picture: string; // New field for the picture URL
}

export const createBlogPost = async (post: BlogPost) => {
  const { title, description, content, picture } = post;
  const [result] = await db.query(
    "INSERT INTO blogposts (title, description, content, picture) VALUES (?, ?, ?, ?)",
    [title, description, content, picture]
  );
  return result;
};

export const getAllBlogPosts = async () => {
  // Select only the title, description, and picture columns
  const [rows] = await db.query(
    "SELECT title, description, picture, id FROM blogposts"
  );
  return rows;
};

export const getBlogPostByIdQuery = async (id: number) => {
  // Select only the title, description, and picture columns
  const [rows] = await db.query("SELECT * FROM blogposts WHERE id = ?", [id]);
  return rows;
};

export const removeBlogPostById = async (id: number) => {
  const query = "DELETE FROM blogposts WHERE id = ?";
  const [result] = await db.execute(query, [id]);
  return result;
};

export const updateBlogPostById = async (id: number, updatedPost: any) => {
  const { title, description, content, picture } = updatedPost;

  const query = `
    UPDATE blogposts
    SET title = ?, description = ?, content = ?, picture = ?
    WHERE id = ?
  `;

  const values = [title, description, content, picture, id];

  const [result] = await db.query(query, values);
  return result;
};
