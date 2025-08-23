import express from "express"
import { fetchStoreRatings, fetchStores, upsertRating } from "../controller/storesController.js"
import { authorize } from "../middleware/auth.js"

const router = express.Router()
router.get("/", authorize(['admin', 'user']), fetchStores)
router.get("/ratings", authorize(["owner"]), fetchStoreRatings)
router.post("/ratings/upsert", authorize(["user"]), upsertRating)

export default router