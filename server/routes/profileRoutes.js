import express from "express";

import {
  getProfile,
  updateProfile,
  getColleges,
  sendCollegeOtp,
  verifyCollegeOtp
} from "../controllers/profileController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);
router.get("/colleges", requireAuth, getColleges);
router.post("/college/send-otp", requireAuth, sendCollegeOtp);
router.post("/college/verify-otp", requireAuth, verifyCollegeOtp);

export default router;
