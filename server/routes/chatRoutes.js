const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/users", protect, getUsers);

module.exports = router;