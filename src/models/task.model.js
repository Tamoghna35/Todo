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
        category: {
            type: DataTypes.ENUM,
            values: ["WORK", "HOME", "LEARNING"],
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM,
            values: ["HIGH", "MEDIUM", "LOW"],
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ["TODO", "IN_PROGRESS", "COMPLETED"],
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    },
    { timestamps: true }
);
