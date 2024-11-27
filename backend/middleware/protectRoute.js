import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		// Extract the JWT token from cookies
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		// Verify and decode the token, ensure we extract the correct 'id' or 'userId'
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		// Ensure the token has the correct field 'id' or 'userId'
		const userId = decoded.id || decoded.userId; // Check if it’s 'id' or 'userId' based on token generation
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized - User ID missing from token" });
		}

		// Find the user by ID, and exclude the password field from the response
		const user = await User.findById(userId).select("-password");

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach the user to the request object for further use in routes
		req.user = user;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// Log the error for debugging and send a response
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
