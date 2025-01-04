import { sequelize } from "../db.config.js";
import { DataTypes } from "sequelize";


export const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Provide valid email format"
                }
            }

        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING, // cloudinary url
            required: true,
        },
        refreshToken: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true
    }
)