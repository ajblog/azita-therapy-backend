import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost", // Your MySQL host (default: localhost)
  user: "root", // Your MySQL username
  password: "Ali99197813#", // Your MySQL password
  database: "azita_therapy_db", // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
