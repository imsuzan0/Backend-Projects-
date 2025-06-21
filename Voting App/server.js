import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import userRouter from "./routes/user.route.js";
import candidateRouter from "./routes/candidate.route.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/user",userRouter)
app.use("/api/candidate",candidateRouter)

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

start();
