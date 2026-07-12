const multer = require("multer");

// Store the uploaded file temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

module.exports = upload;