const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// Upload Image
router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;