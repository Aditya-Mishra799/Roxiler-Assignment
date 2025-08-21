import express from "express"
import { loginUser, logoutUser, registerUser, updatePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/logout', logoutUser)
router.post('/auth/update-password', authenticate, updatePassword)
export default router
