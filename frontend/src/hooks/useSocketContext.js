import { useContext } from "react";
import { SocketContext } from "../context/SocketContext.jsx";

export const useSocketContext = () => {
    return useContext(SocketContext);
};
