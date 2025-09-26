import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/user.model.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();

app.use(express.json()); //middleware

const PORT = process.env.PORT || 5000;

//API Endpoints
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});
