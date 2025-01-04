/** @format */

import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
        const saltRound = 10;
        const bcryptPassword = await bcrypt.hash(password, saltRound);
        return bcryptPassword;
    } catch (error) {
        console.log(`Error inhashing password`);
    }
};

export const compare_password = async (user_inputPassword, hashed_password) => {
    try {
        const isMatched = await bcrypt.compare(user_inputPassword, hashed_password);
        return isMatched;
    } catch (error) {
        console.log(`error while compare Password`);
    }
};
