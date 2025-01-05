import { Router } from "express";
import { RegisterUser, RegisterUserN } from "../controllers/user.controller.js";

const router = Router()

// router.route("/register_user").post(RegisterUser)
router.route("/register_user").post(RegisterUserN)

export { router as User_Router }