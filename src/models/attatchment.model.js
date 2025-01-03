import { sequelize } from "../db.config.js";
import { DataTypes } from "sequelize";
import { Task } from "./task.model.js";

const Attatchment = sequelize.define("Attatchment", {
    attchment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: "task_id"
        },
        onDelete: "CASCADE"
    },
    fie_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true })
export default Attatchment