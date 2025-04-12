import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "1d",
    });

    // Convert expiry to integer (milliseconds)
    const cookieExpiry = parseInt(process.env.COOKIE_EXPIRY) || 24 * 60 * 60 * 1000;

    // ✅ Updated cookie settings for cross-origin (Vercel <-> Render)
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true for HTTPS
        sameSite: "None", // ✅ Allow cross-site requests (required for Vercel <-> Render)
        maxAge: cookieExpiry,
    });
};

export default generateTokenAndSetCookie;
