import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// HTTP server setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "https://localhost:3000", // Frontend domain
        methods: ["GET", "POST"],
    },
    pingTimeout: 10000,
    pingInterval: 5000,
    maxHttpBufferSize: 1e6, // Limit message size to 1 MB
});

const userSocketMap = new Map(); // Use Map for better performance and scalability

/**
 * 
 * @param {string} receiverId - The ID of the receiving user
 * @returns {string | undefined} - The socket ID of the receiver
 */
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;

    // Register the connected user
    if (userId && userId !== "undefined") {
        userSocketMap.set(userId, socket.id);
        console.log(`User registered: ${userId} -> ${socket.id}`);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    // Listen for disconnection events
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove the user from the map
        const disconnectedUserId = [...userSocketMap.entries()].find(
            ([, value]) => value === socket.id
        )?.[0];
        if (disconnectedUserId) {
            userSocketMap.delete(disconnectedUserId);
            console.log(`User unregistered: ${disconnectedUserId}`);
        }
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });

    socket.on("sendMessage", (data) => {
        const { receiverId, message } = data;
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", { message, senderId: userId });
        }
    });

    // Add this for file sharing
    socket.on("sendFile", (fileData) => {
        socket.to(fileData.chatId).emit("fileMessage", fileData);
    });

    socket.on("typing", (chatId) => {
        socket.to(chatId).emit("typing", chatId);
    });

    socket.on("stopTyping", (chatId) => {
        socket.to(chatId).emit("stopTyping");
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});


export { app, io, server };
