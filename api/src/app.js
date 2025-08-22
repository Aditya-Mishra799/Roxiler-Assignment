import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import storeRouter from "./routes/stores.js"
import { authenticate, authorize } from "./middleware/auth.js";
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.use("/admin", authenticate, authorize(["admin"]), adminRouter);
app.use("/stores", authenticate, storeRouter);
app.get("/", (req, res) => res.json("API is running...."));

export default app;
