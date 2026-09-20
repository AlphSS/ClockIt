import "dotenv/config";

console.log("SERVER FILE STARTED");
console.log("RESEND KEY LOADED:", !!process.env.RESEND_API_KEY);

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import stayRoutes from "./routes/stayRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/stays", stayRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ClockIt API is running",
  });
});

const PORT = process.env.PORT || 5800;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
