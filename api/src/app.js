import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js"
const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'));
app.use(authRouter)

app.use('/', (req, res)=>res.json("API is running...."))

export default app;