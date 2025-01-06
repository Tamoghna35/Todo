/** @format */

import { sequelize } from "../db.config.js";
import { Task } from "./task.model.js";

import { User } from "./user.model.js";
// export const CONNECT_DB = async () => {
//     try {
//         await sequelize.authenticate()
//         await sequelize.sync()
//         console.log("db connected");

//     } catch (error) {
//         console.log("ERROR whilw connecting DB");

//     }
// }



// one-to-many relationship

User.hasMany(Task, { foreignKey: "user_id" })
Task.belongsTo(User, { foreignKey: "user_id" })



export const CONNECT_DB = () => {
    return sequelize
        .authenticate()
        .then(() => {
            const t = sequelize.sync({ alter: true });
            console.log(typeof (t));

            return sequelize.sync({ alter: true });
        })
        .then(() => {
            console.log("db conncted");
        })
        .catch((error) => {
            console.log(error);
        });
};

export {
    Task,
    User
}