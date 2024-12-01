import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// Hook to use AuthContext
export const useAuthContext = () => {
    return useContext(AuthContext);
};

// AuthContextProvider Component
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("chat-user")) || null
    );

    const BASE_URL = "https://chat-app-ict4.onrender.com";

    /**
     * Function to log in the user.
     * @param {string} username - Username entered by the user.
     * @param {string} password - Password entered by the user.
     */
    const loginUser = async (username, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.user) {
                setAuthUser(data.user);
                localStorage.setItem("chat-user", JSON.stringify(data.user));
            } else {
                console.error("Login response does not contain user data:", data);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loginUser }}>
            {children}
        </AuthContext.Provider>
    );
};
