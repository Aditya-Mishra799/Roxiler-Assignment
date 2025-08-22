import express from "express"
import { getUserDeatils, loginUser, logoutUser, registerUser, updatePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/update-password', authenticate, updatePassword)
router.get('/user-details', authenticate ,getUserDeatils)
export default router
