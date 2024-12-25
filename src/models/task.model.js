/** @format */

import { sequelize } from "../db.config.js";
import { DataTypes } from "sequelize";

export const Task = sequelize.define(
    "task_table",
    {
        task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        task_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true }
);
