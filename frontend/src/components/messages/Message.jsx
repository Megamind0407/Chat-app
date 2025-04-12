/* eslint-disable react/prop-types */
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

// eslint-disable-next-line react/prop-types
const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	// eslint-disable-next-line react/prop-types
	const fromMe = message.senderId === authUser._id;
	// eslint-disable-next-line react/prop-types
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	// eslint-disable-next-line react/prop-types
	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
				{/* Render text message if exists */}
				{message.message && <p>{message.message}</p>}

				{/* Render file if exists */}
				{message.fileUrl && (
					<div className="mt-2">
						{message.fileType.startsWith("image/") ? (
							<img
								src={message.fileUrl}
								alt="sent file"
								className="max-w-xs max-h-60 rounded shadow-md"
							/>
						) : message.fileType === "application/pdf" ? (
							<a
								href={message.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400 underline"
							>
								📄 View PDF
							</a>
						) : (
							<a
								href={message.fileUrl}
								download
								className="text-green-400 underline"
							>
								⬇️ Download File
							</a>
						)}
					</div>
				)}

			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;