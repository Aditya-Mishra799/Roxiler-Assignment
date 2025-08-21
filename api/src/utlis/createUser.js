import pool from "../config/db.js";
import { userSchema } from "../validation_schema/userValidation.js";
import { hashPassword } from "./hash.js";

export const createUser = async(user)=>{
    const userValidationResul = userSchema.safeParse(user);
    if (!userValidationResul.success) {
        return {
            created: false,
            message: "Invalid Data",
            details: userValidationResul.error.errors.map((error) => error.message),
        }
    }
    // Check if user email already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email=$1", [
        user.email,
      ]);
      if (userExists.rows[0]) {
        return {
            created: false,
            message: "User email already registered.",
        }
      }
      const hashedPassword = await hashPassword(user.password);
      // Insert the user user
      const userInsert = await pool.query(
        `INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [user.name, user.email, hashedPassword, user.address, user.role]
      );

      return {
        created: true,
        data: userInsert.rows,
        message: "User Created Successfully."
      }

}