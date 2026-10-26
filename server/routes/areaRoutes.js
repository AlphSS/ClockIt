import express from "express";

import {
  getAreas,
  getAreaById,
  getAreaReviews,
  createAreaReview,
} from "../controllers/areaController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAreas);
router.get("/:id", getAreaById);
router.get("/:id/reviews", getAreaReviews);
router.post("/:id/reviews", requireAuth, createAreaReview);

export default router;
