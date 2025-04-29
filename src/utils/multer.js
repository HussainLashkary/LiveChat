const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const name = req.body.name.replace(/\s+/g, "_")
        const ext = path.extname(file.originalname);
        const filename = name  + ext; // Simpler naming format
        cb(null, filename);
    }
});

const uploadFile = multer({storage})

module.exports = uploadFile