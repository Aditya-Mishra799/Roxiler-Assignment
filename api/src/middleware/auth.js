import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";
dotenv.config();

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query("SELECT name, email, id, role, password  FROM users WHERE id = $1 AND role = $2;", [decoded.id, decoded.role])
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user; 
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
    return res.status(403).json({ message: "Forbidden: insufficient acesss rights" });
  }
  next();
};
