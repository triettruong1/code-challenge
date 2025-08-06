import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import mongoose from "mongoose";
import { rootRouter } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;

if (!DB_PASSWORD || DB_PASSWORD === "your_db_password") {
  throw new Error("DB_PASSWORD is not defined in the environment variables.");
}

if (!DB_USER || DB_USER === "your_db_user") {
  throw new Error("DB_USER is not defined in the environment variables.");
}

export const createServer = () => {
  mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.9hq3hhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;`
    )
    .then(() => {
      console.log("Connected to MongoDB successfully!");
    });

  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(rootRouter);

  return app;
};
