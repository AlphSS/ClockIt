import express from "express";
import multer from "multer";

import {
  getStays,
  getFeaturedStays,
  getMyListings,
  getStayById,
  createStay,
  updateStay,
  deleteStay,
  saveStay,
  unsaveStay,
  recordView,
  createInquiry,
  seedStays,
  uploadImage,
} from "../controllers/stayController.js";

import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// multer for image uploads — store in memory for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."), false);
    }
  },
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/seed", seedStays);          // Dev-only seed endpoint
router.get("/featured", getFeaturedStays);
router.get("/", getStays);

// ── Protected routes (must be before /:id to avoid param collision) ───────────
router.get("/my/listings", requireAuth, getMyListings);
router.post("/", requireAuth, createStay);
router.post("/upload/image", requireAuth, upload.single("image"), uploadImage);

router.get("/:id", optionalAuth, getStayById);
router.put("/:id", requireAuth, updateStay);
router.delete("/:id", requireAuth, deleteStay);

router.post("/:id/save", requireAuth, saveStay);
router.delete("/:id/save", requireAuth, unsaveStay);
router.post("/:id/view", optionalAuth, recordView);
router.post("/:id/inquiries", requireAuth, createInquiry);

export default router;
