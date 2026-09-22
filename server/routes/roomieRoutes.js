import express from "express";

import {
  createRoomieListing,
  getRoomieListings,
  getRoomieListingById,
  getMyRoomieListings,
  updateRoomieListing,
  deleteRoomieListing,
} from "../controllers/roomieController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRoomieListings);

router.get(
  "/user/me/listings",
  requireAuth,
  getMyRoomieListings
);

router.get("/:id", getRoomieListingById);

router.post("/", requireAuth, createRoomieListing);

router.put(
  "/:id",
  requireAuth,
  updateRoomieListing
);

router.delete(
  "/:id",
  requireAuth,
  deleteRoomieListing
);

export default router;