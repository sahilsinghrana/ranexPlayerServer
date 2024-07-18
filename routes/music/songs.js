const router = require("express").Router();

const {
  addSongController,
  getPublicSongsController,
} = require("../../controller/music/songs.controller.js");
const { checkAdminMiddleware } = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicSongsController)
  .post(checkAdminMiddleware, addSongController);

module.exports = router;
