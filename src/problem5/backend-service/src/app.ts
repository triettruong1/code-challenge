import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import mongoose from "mongoose";
import { rootRouter } from "./routes";

export const createServer = () => {
  mongoose
    .connect(
      "mongodb+srv://problem5-2:KwYqRthhO9wZeOPW@cluster0.9hq3hhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;"
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
