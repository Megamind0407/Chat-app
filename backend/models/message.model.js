import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			// ✅ Removed `required: true` to make it optional
		},
		fileUrl: {
			type: String,
		},
		fileType: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
