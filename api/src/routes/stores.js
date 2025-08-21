import express from "express"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()
router.use(authenticate)
router.post("/list")

export default router