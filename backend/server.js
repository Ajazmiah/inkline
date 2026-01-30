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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  // Send all other routes to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Error middleware
app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`Server started on ${port}`));
