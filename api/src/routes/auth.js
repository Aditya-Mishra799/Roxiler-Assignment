import express from "express"
import { loginUser, logoutUser, registerUser } from "../controller/authController.js";

const router = express.Router();

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/logout', logoutUser)
export default router