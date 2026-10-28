import express from "express";
import multer from "multer";

import {
  getStays,
  getFeaturedStays,
  getMyListings,
  getStayById,
  createStay,
  updateStay,
  updateStayStatus,
  deleteStay,
  saveStay,
  unsaveStay,
  recordView,
  createInquiry,
  seedStays,
  uploadImage,
  getStayReviews,
  createStayReview,
  updateStayReview,
  deleteStayReview,
} from "../controllers/stayController.js";

import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Multer for image uploads — store in memory for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."), false);
    }
  },
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/seed", seedStays);
router.get("/featured", getFeaturedStays);
router.get("/", getStays);

// ── Protected routes (must be defined before /:id to avoid collision) ─────────
router.get("/my/listings", requireAuth, getMyListings);
router.post("/", requireAuth, createStay);
router.post("/upload/image", requireAuth, upload.single("image"), uploadImage);

// ── Specific stay routes ──────────────────────────────────────────────────────
router.get("/:id", optionalAuth, getStayById);
router.put("/:id", requireAuth, updateStay);
router.patch("/:id/status", requireAuth, updateStayStatus);
router.delete("/:id", requireAuth, deleteStay);

// Wishlist / Save
router.post("/:id/save", requireAuth, saveStay);
router.delete("/:id/save", requireAuth, unsaveStay);

// Views & Inquiries
router.post("/:id/view", optionalAuth, recordView);
router.post("/:id/inquiries", requireAuth, createInquiry);

// Reviews
router.get("/:id/reviews", getStayReviews);
router.post("/:id/reviews", requireAuth, createStayReview);
router.put("/:id/reviews/:reviewId", requireAuth, updateStayReview);
router.delete("/:id/reviews/:reviewId", requireAuth, deleteStayReview);

export default router;
