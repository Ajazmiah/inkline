import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  "http://localhost:5000",
  "https://inkline.onrender.com",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);

// --- Serve React frontend ---
const __dirname = path.resolve(); // needed because using ES modules

// 1. Serve static files (css, js, images) from the React build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// 2. The "Catch-All" Route
// This fixes the issue where refreshing "/profile" or "/forgot-password" gave a 404.
// It tells Express: "If the route isn't an API route, send the React index.html"
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Error middleware
// (These will now only trigger for API errors or non-GET requests that don't match)
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`));