import express from "express";
import { logout, updateDetails, userSignin, userSignUp } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/user-signup", userSignUp);
router.post("/user-signin", userSignin);
router.put("/update-user",verifyToken, updateDetails);
router.get("/logout",logout);

export default router