import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
<<<<<<< Updated upstream
=======
import profileRoutes from "./routes/profileRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
>>>>>>> Stashed changes

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
<<<<<<< Updated upstream
=======
app.use("/api/profile", profileRoutes);
app.use("/api/marketplace", marketplaceRoutes);
>>>>>>> Stashed changes

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UniNest API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
