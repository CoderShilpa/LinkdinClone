// backend/server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// ------------------------------------
// 1. Import ALL Route Files
// ------------------------------------
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import profileRoutes from "./routes/profile.js";

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// --- Middleware ---
// ✅ Updated CORS to allow both local + deployed frontend
app.use(
  cors({
    origin: [
      "https://linkdin-clone-v2mx.vercel.app", // your deployed frontend
      "http://localhost:5173", // for local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Enable JSON parsing
app.use(express.json({ extended: false }));

// Default route
app.get("/", (req, res) => res.send("API Running"));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
