import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
app.use(express.json());

//middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

export {app}
