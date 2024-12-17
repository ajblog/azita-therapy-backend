import express from "express";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import path from "path";
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
