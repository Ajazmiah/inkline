import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import ejs from "ejs";
import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


const allowedOrigins = [
  "http://localhost:5000",
  "https://inkline.onrender.com/",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

connectDb();

app.use(express.json()); // if clinets send data to user(no form)
app.use(express.urlencoded({ extended: true })); // client sends data using HTML form or URL-encoded format

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);

//app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "templates"));

app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`Server started on ${port}`));