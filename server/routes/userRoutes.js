import express from "express";
import {
  getSavedStays,
  getRecentlyViewed,
  getMyInquiries,
} from "../controllers/stayController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me/saved-stays", requireAuth, getSavedStays);
router.get("/me/recently-viewed", requireAuth, getRecentlyViewed);
router.get("/me/inquiries", requireAuth, getMyInquiries);

export default router;
