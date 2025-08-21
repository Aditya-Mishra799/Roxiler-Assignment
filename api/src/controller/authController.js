import express from "express";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utlis/hash.js";
import pool from "../config/db.js";
import { z } from "zod";
import { userSchema } from "../validation_schema/userValidation.js";

const ROLE = "user"; // asuming default role for self register
export const registerUser = async (req, res) => {
  const result = z.safeParse(userSchema, req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid Data", details: result.error });
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
    console.log(hashed);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING email, name, role;
      `,
      [name, email, hashed, address, role]
    );
    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.log(error);
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

export const logoutUser = async (req, res) =>{
  res.clearCookie("token");
  res.json({message: "Logged out successfully"})
}
