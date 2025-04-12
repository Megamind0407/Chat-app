import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	//Add Backend Url
	const BASE_URL = "https://chat-app-3zo9.onrender.com";
	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				// Fetch request with error handling
				const res = await fetch(`${BASE_URL}/api/messages/${selectedConversation._id}`);

				// Check if the response is ok (status code 200-299)
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

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};

export default useGetMessages;
