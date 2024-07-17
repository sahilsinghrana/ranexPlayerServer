const router = require("express").Router();

const {
  addSongController,
  getPublicSongsController,
} = require("../../controller/music/songs.controller.js");

router.get("/", getPublicSongsController);
router.post("/", addSongController);

module.exports = router;
