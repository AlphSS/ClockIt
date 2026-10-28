import express from "express";

import {
  getProfile,
  updateProfile,
  getColleges,
  sendCollegeOtp,
  verifyCollegeOtp,
  getPreferences,
  updatePreferences,
} from "../controllers/profileController.js";

import { requireAuth } from "../middleware/auth.js";



const router = express.Router();


router.get("/", requireAuth, getProfile);

router.put("/", requireAuth, updateProfile);

router.get("/colleges", requireAuth, getColleges);

router.post("/college/send-otp", requireAuth, sendCollegeOtp);

router.post("/college/verify-otp", requireAuth, verifyCollegeOtp);

// Preference routes
router.get("/preferences", requireAuth, getPreferences);

router.put("/preferences", requireAuth, updatePreferences);



export default router;
