import express from "express"
import { fetchStores, upsertRating } from "../controller/storesController.js"
import { authorize } from "../middleware/auth.js"

const router = express.Router()
router.get("/", authorize(['admin', 'user']), fetchStores)
router.get("/ratings", authorize(["owner"]))
router.post("/ratings/upsert", authorize(["user"]), upsertRating)

export default router