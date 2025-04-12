import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	//Add Backend Url
	const BASE_URL = "https://chat-app-3zo9.onrender.com";
	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			// Check fetch call
			console.log("Sending signup request:", { fullName, username, password, confirmPassword, gender });

			const res = await fetch(`${BASE_URL}/api/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json", // Ensure Accept header requests JSON
				},
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			// Handle responses that are not JSON
			const contentType = res.headers.get("Content-Type") || "";
			if (!contentType.includes("application/json")) {
				const errorText = await res.text();
				throw new Error(`Unexpected response: ${errorText}`);
			}

			// Parse JSON response
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Signup failed");
			}

			// Store user data and notify success
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
			toast.success("Signup successful!");
		} catch (error) {
			console.error("Signup error:", error.message);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
