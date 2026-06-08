const router = require("express").Router();

const upload = require("../middlewares/uploadAudio");

router.post("/audio", upload.single("audio"), (req, res) => {
  res.json({
    title: req.body.title,
    audio: `/uploads/audio/${req.file.filename}`,
  });
});

module.exports = router;
