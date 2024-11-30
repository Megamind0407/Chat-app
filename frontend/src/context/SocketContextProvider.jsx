import { createContext, useMemo, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { authUser } = useAuthContext();
    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = useMemo(() => {
        if (authUser) {
            // eslint-disable-next-line no-undef
            const SERVER_URL = process.env.NODE_ENV === "production"
                ? "https://chat-app-ict4.onrender.com"
                : "http://localhost:5000";

            return io(SERVER_URL, {
                transports: ["websocket"],
                query: { userId: authUser._id },
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                timeout: 10000,
            });
        }
        return null;
    }, [authUser]);

    useEffect(() => {
        if (socket) {
            console.log("WebSocket connected:", socket.id);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => {
                console.log("WebSocket disconnected:", socket.id);
                socket.disconnect();
            };
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
