import express from "express"
import { createNewUser, createStore, fetchUsers, getDashboardMetrics } from "../controller/adminController.js"
const router = express.Router()
router.post("/create-store", createStore)
router.post("/add-user", createNewUser)
router.get("/users", fetchUsers)
router.get("/dashboard-metrics", getDashboardMetrics)
export default router