const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/audio");
  },

  filename(req, file, cb) {
    const title = req.body.title
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const unique = Date.now();

    cb(null, `${title}-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];

  cb(null, allowed.includes(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
