import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register_user").post(RegisterUser)

export { router as User_Router }