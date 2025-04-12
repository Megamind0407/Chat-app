import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: true, // ✅ required for HTTPS
		sameSite: "None", // ✅ allows cross-origin cookie sharing
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};


export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender = "male" } = req.body;

		if (!fullName || !username || !password || !confirmPassword) {
			return res.status(400).json({ error: "All fields are required" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const profilePic =
			gender.toLowerCase() === "male"
				? `https://avatar.iran.liara.run/public/boy?username=${username}`
				: `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic,
		});

		await newUser.save();
		generateTokenAndSetCookie(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			username: newUser.username,
			profilePic: newUser.profilePic,
		});
	} catch (error) {
		console.error("Error in signup controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: "Username and password are required" });
		}

		const user = await User.findOne({ username });

		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.error("Error in login controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", {
			httpOnly: true,
			expires: new Date(0),
			sameSite: "None",
			secure: true,
		});
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
