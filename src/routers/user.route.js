import { Router } from "express";
import { RegisterUser, RegisterUserN, LogInUserN, LogoutUserN, RegenerateAccessToken } from "../controllers/user.controller.js";
import { VerifyJWT } from "../utils/verifyJWT.util.js";

const router = Router()

// router.route("/register_user").post(RegisterUser)
router.route("/register_user").post(RegisterUserN)
router.route("/logIn_user").post(LogInUserN)
router.route("/logOut_user").post(VerifyJWT, LogoutUserN)
router.route("/regenerate_accessToken").post(RegenerateAccessToken)

export { router as User_Router }