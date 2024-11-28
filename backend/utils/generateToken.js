import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "1d",
    });

    // Setting the token as a secure, httpOnly cookie
    res.cookie("jwt", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict", 
        maxAge: process.env.COOKIE_EXPIRY || 24 * 60 * 60 * 1000,
    });
};

export default generateTokenAndSetCookie;
