const router = require("express").Router();

const {
  addSongController,
  getPublicSongsController,
} = require("../../controller/music/songs.controller.js");
const {
  checkAdminMiddleware,
  authMiddleware,
} = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicSongsController)
  .post(authMiddleware, checkAdminMiddleware, addSongController);

module.exports = router;
