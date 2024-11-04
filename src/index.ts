import express from "express";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
