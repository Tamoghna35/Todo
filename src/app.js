/** @format */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Task_Router from "./routers/task.router.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ limit: "15kb", extended: true }));
app.use(cookieParser());
app.use("/task", Task_Router);

export default app;
