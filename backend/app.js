import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
app.use(express.json());

//middlewares
// Configure CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://chatapp-roan-mu.vercel.app', // Deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // If you're using cookies (e.g., for JWT in HTTP-only cookies)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


//ROUTES
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

export {app}
