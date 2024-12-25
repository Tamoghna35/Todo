/** @format */

import { sequelize } from "../db.config.js";
import { Task } from "./task.model.js";
// export const CONNECT_DB = async () => {
//     try {
//         await sequelize.authenticate()
//         await sequelize.sync()
//         console.log("db connected");

//     } catch (error) {
//         console.log("ERROR whilw connecting DB");

//     }
// }

export const CONNECT_DB = () => {
    return sequelize
        .authenticate()
        .then(() => {
            return sequelize.sync();
        })
        .then(() => {
            console.log("db conncted");
        })
        .catch((error) => {
            console.log(error);
        });
};

export {
    Task
}