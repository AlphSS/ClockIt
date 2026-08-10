import express from "express";

import { registerUser } from "../controllers/authController.js";

import { sendOtp, verifyPhoneOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyPhoneOtp);
router.post("/register", registerUser);

export default router;
