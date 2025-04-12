// routes/upload.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure the 'uploads' folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Set up multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}
	res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

export default router;
