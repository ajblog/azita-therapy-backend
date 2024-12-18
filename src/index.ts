import express from "express";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import articleRoutes from "./routes/articlesRoutes";
import path from "path";
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);
app.use("/api", articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
