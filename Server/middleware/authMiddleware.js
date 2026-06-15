const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);
    console.log("JWT SECRET:", process.env.JWT_SECRET);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.log("TOKEN ERROR:", error.message);

    res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};

module.exports = protect;