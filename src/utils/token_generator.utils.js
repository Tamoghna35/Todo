/** @format */

import jwt from "jsonwebtoken";

export const accessToken = (user) => {
    try {
        const payload = { name: user.user_name, email: user.email };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIARY,
        });
        return token; // Return the generated token
    } catch (error) {
        console.error("Error generating access token:", error.message);
        throw error; // Throw error if needed
    }
};

export const accessTokenPromise = (user) => {
    const payload = { name: user.user_name, email: user.email };
    const tokenPromise = new Promise((resolve, reject) => {
        try {
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIARY,
            });
            resolve(token);
        } catch (error) {
            reject(error);
        }
    });
    return tokenPromise
        .then((token) => {
            return token;
        })
        .catch((error) => {
            console.error("Error generating AccessToken", error.message);
            throw error;
        });
};
