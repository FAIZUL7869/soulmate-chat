const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;