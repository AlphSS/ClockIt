import express from "express";
import multer from "multer";

import {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  markProductAsSold,
  uploadProductImage,
} from "../controllers/marketplaceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG and WebP images are allowed."));
    }

    cb(null, true);
  },
});

router.get("/products", getProducts);
router.get("/my-products", requireAuth, getMyProducts);
router.get("/products/:id", getProductById);

router.put("/products/:id", requireAuth, updateProduct);

router.delete("/products/:id", requireAuth, deleteProduct);

router.patch("/products/:id/sold", requireAuth, markProductAsSold);

router.post("/products", requireAuth, createProduct);
router.post("/products/:id/images", requireAuth, upload.single("image"), uploadProductImage);

export default router;
