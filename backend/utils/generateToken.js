import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    // Ensure the token is signed with 'userId' as it is the unique identifier
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "1d", // Default to 1 day expiry if not provided in .env
    });

    // Setting the token as a secure, httpOnly cookie
    res.cookie("jwt", token, {
        httpOnly: true, // Ensures the cookie can't be accessed by JavaScript (important for security)
        secure: process.env.NODE_ENV === "production", // Secure cookies in production environment (https)
        sameSite: "strict", // Helps protect against CSRF attacks by restricting cookies to first-party contexts
        maxAge: process.env.COOKIE_EXPIRY || 24 * 60 * 60 * 1000, // Cookie expiry duration (1 day by default)
    });
};

export default generateTokenAndSetCookie;
