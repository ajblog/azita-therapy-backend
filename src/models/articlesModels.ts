import { db } from "../config/db";

export interface IArticle {
  name: string;
  description: string;
  writer: string[];
  file_address: string; // New field for the picture URL,
  released_date: string;
}

export const createArticle = async (post: IArticle) => {
  const { name, description, released_date, file_address, writer } = post;

  // Convert `writer` to a JSON string if necessary
  const writerJSON = JSON.stringify(writer);

  const [result] = await db.query(
    "INSERT INTO articles (name, description, released_date, file_address, writer) VALUES (?, ?, ?, ?, ?)",
    [name, description, released_date || null, file_address, writerJSON]
  );
  return result;
};

export const getArticleByIdQuery = async (id: number) => {
  // Select only the title, description, and picture columns
  const [rows] = await db.query("SELECT * FROM articles WHERE id = ?", [id]);
  return rows;
};

export const deleteArticleByQuery = async (id: number) => {
  const query = "DELETE FROM articles WHERE id = ?";
  const [result] = await db.execute(query, [id]);
  return result;
};

export const getAllArticles = async () => {
  // Select only the title, description, and picture columns
  const [rows] = await db.query("SELECT * FROM articles");
  return rows;
};
