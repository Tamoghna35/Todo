import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const VerifyJWT = (req, _, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        return res.status(404).json({ error: "User is not authorized" })
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);

    try {
        User.findOne({ where: { email: decodedToken.email } }).then((user) => {
            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }
            const { hashPassword, refreshToken, ...modifiedUser } = user.toJSON()
            req.user = modifiedUser
            next()
        })
    } catch (error) {
        res.status(401).json({ error: "Invalid token", details: err.message });
    }
}