import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json()); //middleware
app.use(cookieParser());



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // falls du Cookies oder Auth-Headers brauchst
}));

const PORT = process.env.PORT || 5000;

//API Endpoints
app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("DB connection failed:", error);
});
