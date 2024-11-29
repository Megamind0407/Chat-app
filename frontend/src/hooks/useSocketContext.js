import { useContext } from "react";
import { SocketContext } from "../context/SocketContextProvider.jsx";

export const useSocketContext = () => {
    return useContext(SocketContext);
};
