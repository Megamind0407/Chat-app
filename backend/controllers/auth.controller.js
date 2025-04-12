import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender = "male" } = req.body;

		// Check if all required fields are provided
		if (!fullName || !username || !password || !confirmPassword) {
			return res.status(400).json({ error: "All fields are required" });
		}

		// Password match validation
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		// Check if username already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Generate profile picture URL based on gender
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
		const profilePic = gender.toLowerCase() === "male" ? boyProfilePic : girlProfilePic;

		// Create new user
		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic,
		});

		// Save user and generate JWT
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
		res.status(500).json("Internal Server Error" );
	}
};


export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if username and password are provided
		if (!username || !password) {
			return res.status(400).json("Username and password are required" );
		}

		// Find user by username
		const user = await User.findOne({ username });

		// Validate user existence and password correctness
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
		if (!user || !isPasswordCorrect) {
			return res.status(400).json("Invalid username or password" );
		}

		// Generate JWT token and send user data
		generateTokenAndSetCookie(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.error("Error in login controller:", error.message);
		res.status(500).json("Internal Server Error" );
	}
};
export const logout = (req, res) => {
	try {
		// Clear the JWT cookie
		res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller:", error.message);
		res.status(500).json("Internal Server Error" );
	}
};
