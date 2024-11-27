import express from "express"; // Use import instead of require
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Added for CORS support

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config(); // Load environment variables

// Ensure compatibility for __dirname in ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for frontend on different port
app.use(cors({
    origin: "http://localhost:3000" || "https://chat-app-jade-chi.vercel.app/", // Update if the frontend is hosted elsewhere
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Debugging middleware to log requests
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Catch-all handler for single-page app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(process.env.PORT || 5000, () => {
    connectToMongoDB(); // Connect to MongoDB
    console.log(`Server Running on port ${process.env.PORT || 5000}`);
});
