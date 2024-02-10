import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const app = express();

app.use(cors());
app.use(express.json());

import apiRoutes from "./app/index.route.js";
app.use("/api", apiRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
