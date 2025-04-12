import { createContext, useContext, useState } from "react";

// Create a context
export const AuthContext = createContext();

// Hook to use the context
export const useAuthContext = () => {
    return useContext(AuthContext);
};

// Provider component
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("chat-user")) || null
    );

    // ✅ Your Render backend URL
    const BASE_URL = "https://chat-app-3zo9.onrender.com";

    /**
     * Function to log in the user.
     * @param {string} username - Username entered by the user.
     * @param {string} password - Password entered by the user.
     */
    const loginUser = async (username, password) => {
        try {
            // ✅ Fixed endpoint path to /api/auth/login
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // ✅ This enables sending/receiving cookies across domains
                credentials: "include",
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
