import { Sequelize } from "sequelize"
import { credentials } from "./credentials/db.credentials.js"

export const sequelize = new Sequelize(
    credentials.development.database,
    credentials.development.username,
    credentials.development.password,
    {
        host: credentials.development.host,
        dialect: credentials.development.dialec,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        }
    }
)