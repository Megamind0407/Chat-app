import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		// Validate input fields
		if (!handleInputErrors(username, password)) return;

		setLoading(true); // Set loading state
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			// Handle non-OK responses
			if (!res.ok) {
				const errorText = await res.text();
				throw new Error(errorText || "Failed to login");
			}

			// Attempt to parse JSON response
			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Save user details and update context
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
			toast.success("Login successful!");
		} catch (error) {
			toast.error(error.message || "An unexpected error occurred");
		} finally {
			setLoading(false); // Reset loading state
		}
	};

	return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}
	return true;
}
