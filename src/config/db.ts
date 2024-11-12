import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Default to localhost if not defined
  user: process.env.DB_USER || "root", // Default to root if not defined
  password: process.env.DB_PASSWORD || "", // Default to empty string if not defined
  database: process.env.DB_NAME || "", // Default to empty string if not defined
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === "true", // Convert string to boolean
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10, // Ensure it's a number, default to 10
  queueLimit: 0,
});
