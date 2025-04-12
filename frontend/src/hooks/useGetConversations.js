import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const BASE_URL = "https://chat-app-3zo9.onrender.com";

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${BASE_URL}/api/users`, {
					method: "GET",
					credentials: "include", 
					withCredentials: true
				});

				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.error || "Failed to fetch conversations");
				}

				const data = await res.json();
				setConversations(data.user ? [data.user] : data); // adapt based on your API shape
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
