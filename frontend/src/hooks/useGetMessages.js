import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const BASE_URL = "https://chat-app-3zo9.onrender.com";

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				// Get the token from localStorage or cookies
				const token = localStorage.getItem("jwt") || document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];

				if (!token) {
					throw new Error("No token found, please login first.");
				}

				const res = await fetch(`${BASE_URL}/api/messages/${selectedConversation._id}`, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`, // Add the token in the Authorization header
					},
				});

				if (!res.ok) {
					throw new Error(`Failed to fetch: ${res.statusText}`);
				}

				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setMessages(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) {
			getMessages();
		}
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};

export default useGetMessages;
