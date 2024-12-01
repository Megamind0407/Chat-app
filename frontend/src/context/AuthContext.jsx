import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(
		JSON.parse(localStorage.getItem("chat-user")) || null
	);

	const BASE_URL = "https://chat-app-ict4.onrender.com";
	const loginUser = async (username, password) => {
		try {
			const response = await fetch(`${BASE_URL}/api/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});
			const data = await response.json();
			if (data.user) {
				setAuthUser(data.user);
				localStorage.setItem("chat-user", JSON.stringify(data.user));
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
