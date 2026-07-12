const upload = require("../config/multer");
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    sendMessage,
    getMessages,
    markDelivered,
    markSeen,
    deleteMessage,
} = require("../controllers/messageController");

// Send a message
router.post("/", protect, upload.single("image"), sendMessage);

// Get chat history
router.get("/:userId", protect, getMessages);

// Mark as delivered
router.patch("/delivered/:messageId", protect, markDelivered);

// Mark as seen
router.patch("/seen/:messageId", protect, markSeen);

// Delete messager
router.delete("/:messageId", protect, deleteMessage);
module.exports = router;