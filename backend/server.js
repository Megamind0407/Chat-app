import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Ensure compatibility for __dirname in ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables

// Debugging for deployment paths
console.log("Resolved __dirname:", __dirname);

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use environment variable or default
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Debugging middleware for requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the frontend
const frontendPath = path.join(__dirname, "static", "dist");
console.log("Serving static files from:", frontendPath);

app.use(express.static(frontendPath));

// Catch-all handler for single-page application (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectToMongoDB(); // Connect to MongoDB
  console.log(`Server Running on port ${PORT}`);
});
