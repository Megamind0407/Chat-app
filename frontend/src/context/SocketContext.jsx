import { createContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser && !socket) {
            const SERVER_URL =
                // eslint-disable-next-line no-undef
                process.env.NODE_ENV === "production"
                    ? "https://chat-app-ict4.onrender.com"
                    : "http://localhost:5000";

            const newSocket = io(SERVER_URL, {
                transports: ["websocket", "polling"],
                query: { userId: authUser._id },
            });

            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [authUser, socket]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
