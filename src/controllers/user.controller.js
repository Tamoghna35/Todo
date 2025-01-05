/** @format */

import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/password_hashed_And_checker.utils.js";
export const RegisterUser = async (req, res) => {
    const { user_name, email, password } = req.body;

    try {
        if (!user_name || !email || !password) {
            return res.status(400).json({ error: "Require Fields are missing" });
        }

        const existing_user = await User.findOne({ where: { email: email } });
        if (existing_user) {
            return res.status(400).json({ error: "User is already Registered" });
        }
        const hashed_password = await hashPassword(password);
        const new_user = {
            user_name,
            email,
            password: hashed_password,
        };

        const created_user = await User.create(new_user);
        if (!created_user) {
            return res.status(400).json({ error: "error in user creation" });
        }
        const { password: user_password, ...user } = created_user.toJSON();
        return res.status(201).json({
            message: "User created Successfully",
            user: user,
        });
    } catch (error) {
        console.error("Error in registering User", error.message);
        return res.status(500).json({ error: "Error in Registering User" });
    }
};

export const RegisterUserN = (req, res) => {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
        return res.status(400).json({ error: "Require Fields are missing" });
    }

    User.findOne({ where: { email: email } })
        .then((existing_user) => {
            if (existing_user) {
                return res.status(400).json({ error: "user is alrady existed" });
            }
            return hashPassword(password);
        })
        .then((hashed_password) => {
            const new_user = {
                user_name,
                email,
                password: hashed_password,
            };
            return User.create(new_user);
        })
        .then((created_user) => {
            if (!created_user) {
                return res.status(400).json({ error: "error in user creation" });
            }
            const { password: user_password, ...user } = created_user.toJSON();
            return res.status(201).json({
                message: "User created Successfully",
                user: user,
            });
        })
        .catch((error) => {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error("Error in registering User:", error.message || error);
            return res.status(500).json({ error: "Error in Registering User" });
        });
};
