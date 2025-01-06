/** @format */

import { User } from "../models/user.model.js";
import {
    compare_password,
    hashPassword,
} from "../utils/password_hashed_And_checker.utils.js";
import {
    accessToken,
    accessTokenPromise,
    refreshTokenPromise,
} from "../utils/token_generator.utils.js";
import jwt from "jsonwebtoken"
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

export const LogInUserN = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "required fields are missing" });
    }

    User.findOne({ where: { email } })
        .then((existing_user) => {
            console.log("Existing user in first then ===>", existing_user);
            if (!existing_user) {
                return res.status(404).json({ error: "User not found" });
            }
            return compare_password(password, existing_user.password).then(
                (isPassword_correct) => {
                    console.log(
                        "isPassword_correct in 1st then ===>",
                        isPassword_correct
                    );

                    return { isPassword_correct, existing_user };
                }
            );
        })
        .then(({ isPassword_correct, existing_user }) => {
            if (!isPassword_correct) {
                return res.status(400).json({ error: "Password is not valid" });
            }

            return Promise.all([
                accessTokenPromise(existing_user),
                refreshTokenPromise(existing_user),
            ]).then(([accessToken, refreshToken]) => ({
                existing_user,
                accessToken,
                refreshToken,
            }));
        })
        .then(({ existing_user, accessToken, refreshToken }) => {
            console.log("Existing user in 3rd then ===>", existing_user);

            console.log("AccessToken in 3rd Then===>", accessToken);
            console.log("RefreshToken in 3rd Then===>", refreshToken);

            if (!accessToken || !refreshToken) {
                return res.status(400).json({
                    error: "accesToken or refreshToken is not generated successfully",
                });
            }

            existing_user.refreshToken = refreshToken;
            return existing_user.save().then(() => ({
                existing_user,
                accessToken,
                refreshToken,
            }));
        })
        .then(({ existing_user, accessToken, refreshToken }) => {
            console.log("existing_user 4th then ==>", existing_user);
            console.log("accessToken 4th then ==>", accessToken);
            console.log("refreshToken 4th then ==>", refreshToken);

            const options = {
                httpOnly: true,
                secure: true,
            };
            const formatedUser = existing_user.toJSON();
            const {
                password,
                refreshToken: refreshToken1,
                ...userWithOutPassword
            } = formatedUser;
            console.log("userWithOutPassword===>", userWithOutPassword);

            res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    message: "User logged in successfully",
                    user: userWithOutPassword,
                });
        })
        .catch((error) => {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error("Error in login User:", error.message || error);
            return res.status(500).json({ error: "Error in Login User" });
        });
};

export const LogoutUserN = (req, res) => {
    const user = req.user;


    // const a = User.findOne({ where: { email: user.email } })
    // console.log("a======>", a);
    // console.log("typeOf a==========>", typeof (a));

    User.findOne({ where: { email: user.email } })
        .then((user) => {
            console.log("User ===>", user);

            user.refreshToken = null;
            user.save().then(() => {
                const options = {
                    httpOnly: true,
                    secure: true,
                };

                res
                    .status(200)
                    .clearCookie("accessToken", options)
                    .clearCookie("refreshToken", options)
                    .json({ message: `${user.user_name} logOut successfully` });
            });
        })
        .catch((error) => {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error("Error in login User:", error.message || error);
            return res.status(500).json({ error: "Error in Login User" });
        });
};



export const RegenerateAccessToken = (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingToken) {
        return res.status(401).json({ error: "Unauthorized Request" })
    }

    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
    if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized request" })
    }

    User.findOne({ where: { email: decodedToken.email } }).then((user) => {
        return accessTokenPromise(user)
    }).then((accessToken) => {
        const options = {
            httpOnly: true,
            secure: true
        }
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                message: "AccessToken Update",
            });

    }).catch((error) => {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error("Error in login User:", error.message || error);
        return res.status(500).json({ error: "Error in Updating AccessToken" });
    });
};






