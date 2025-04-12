import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import useSendMessage from "../../hooks/useSendMessage";
import axios from "axios";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const { loading: sending, sendMessage } = useSendMessage();

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message && !file) return;

		let fileUrl = "";
		let fileType = "";

		if (file) {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);

			try {
				const res = await axios.post("/api/upload", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				fileUrl = res.data.filePath;
				fileType = file.type;
			} catch (err) {
				console.error("File upload failed", err);
				alert("Failed to upload file. Please try again.");
			} finally {
				setUploading(false);
			}
		}

		await sendMessage(message, fileUrl, fileType);
		setMessage("");
		setFile(null);
	};

	return (
		<form className='px-4 my-3 relative' onSubmit={handleSubmit}>
			<div className='w-full flex items-center gap-2'>
				<label className='cursor-pointer text-white'>
					<FiPaperclip size={20} />
					<input
						type='file'
						onChange={handleFileChange}
						className='hidden'
						accept='image/*,application/pdf'
					/>
				</label>

				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message or attach file'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				<button
					type='submit'
					className='text-white'
					disabled={uploading || sending}
				>
					{uploading || sending ? (
						<div className='loading loading-spinner'></div>
					) : (
						<BsSend size={20} />
					)}
				</button>
			</div>

			{file && (
				<p className='text-xs text-gray-400 mt-1 ml-1'>
					Attached: {file.name}
				</p>
			)}
		</form>
	);
};

export default MessageInput;
