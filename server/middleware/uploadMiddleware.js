const multer = require("multer");

// Store uploaded files in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",

            "audio/webm",
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",

            "video/mp4",
            "video/webm",
            "video/quicktime",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type"), false);
        }
    },
});

module.exports = upload;