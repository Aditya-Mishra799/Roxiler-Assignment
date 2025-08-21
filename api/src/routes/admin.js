import express from "express"
import { createNewUser, createStore } from "../controller/adminController.js"
const router = express.Router()
router.post("/create-store", createStore)
router.post("/add-user", createNewUser)

export default router