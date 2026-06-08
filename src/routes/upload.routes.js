const router = require("express").Router();

const upload = require("../middlewares/uploadAudio");
const fs = require("fs");
const path = require("path");

router.post("/audio", upload.single("audio"), (req, res) => {
  const title = req.body.title;

  const ext = path.extname(req.file.originalname);

  const safeTitle = title.trim().replace(/\s+/g, "-").toLowerCase();
  const unique = Date.now();
  const newName = `${safeTitle}-${unique}${ext}`;

  fs.renameSync(req.file.path, path.join("uploads/audio", newName));

  res.json({
    audio: `/uploads/audio/${newName}`,
  });
});

module.exports = router;
