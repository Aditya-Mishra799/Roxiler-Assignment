import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid token, please try again !!!" });
  }
};

export const authorize = (roles) => (req, res, next) => {
  if (typeof roles === "string" && (roles === "*" || roles === req.user.role)) {
    return next();
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient rights" });
  }
  next();
};
