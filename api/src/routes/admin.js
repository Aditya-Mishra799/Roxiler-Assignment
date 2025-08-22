import express from "express"
import { createNewUser, createStore, fetchUsers } from "../controller/adminController.js"
const router = express.Router()
router.post("/create-store", createStore)
router.post("/add-user", createNewUser)
router.get("/users", fetchUsers)
export default router