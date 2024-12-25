/** @format */

import dotenv from "dotenv";
import app from "./app.js";
import { CONNECT_DB } from "./models/index.js";
dotenv.config({
    path: "./src/.env",
});

CONNECT_DB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("in index,js");
        });
    })
    .catch((error) => {
        console.log("error in index");
    });
