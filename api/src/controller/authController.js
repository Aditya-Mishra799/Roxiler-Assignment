import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utlis/hash.js";
import pool from "../config/db.js";
import {
  passwordSchema,
  userSchema,
} from "../validation_schema/userValidation.js";

export const registerUser = async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid Data", details: result.error.errors.map(error => error.message) });
  }
  let { name, email, password, address, role } = req.body;
  if (!req.user || req.user.role !== "admin") {
    role = "user"; // from normal registration only a simple user will be created
  }
  try {
    const alreadyPresent = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (alreadyPresent.rows[0]) {
      return res.status(409).json({
        message:
          "User is already resgistered with this email, try with another email.",
      });
    }
    const hashed = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING email, name, role, id;
      `,
      [name, email, hashed, address, role]
    );
    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIERS_IN,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      ameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const updatePassword = async (req, res) => {
  const id = req.user.id;
  const validationResult = passwordSchema.safeParse(req.body.password);
  if (!validationResult.success) {
    return res
      .status(400)
      .json({
        message: "Invalid password, must follow specified rules",
        details: validationResult.error.errors.map(err => err.message),
      });
  }
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2;",
      [hashedPassword, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
