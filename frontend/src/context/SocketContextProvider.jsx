/* eslint-disable no-undef */
import { createContext, useMemo, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { authUser } = useAuthContext(); 
    const [onlineUsers, setOnlineUsers] = useState([]);

    const SERVER_URL =
        process.env.NODE_ENV === "production"
        ? "https://chat-app-ict4.onrender.com"
        : "http://localhost:5000";


    const socket = useMemo(() => {
        if (authUser) {
            const newSocket = io(SERVER_URL, {
                transports: ["websocket"], 
                query: { userId: authUser._id }, 
                reconnectionAttempts: 10, 
                reconnectionDelay: 3000, 
                timeout: 15000,
            });

            // Add event listener for connection errors
            newSocket.on("connect_error", (err) => {
                console.error("WebSocket connection error:", err.message);
            });

            return newSocket;
        }
        return null; // No socket if user is not authenticated
    }, [authUser, SERVER_URL]);

    useEffect(() => {
        if (socket) {
            console.log("WebSocket connected:", socket.id);

            // Listen for online users
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Cleanup when component unmounts or socket changes
            return () => {
                console.log("WebSocket disconnected:", socket.id);
                socket.off("getOnlineUsers"); // Remove specific listeners
                socket.disconnect(); // Disconnect the WebSocket
            };
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
