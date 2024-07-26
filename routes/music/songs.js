const router = require("express").Router();

const {
  addSongController,
  getPublicSongsController,
  getPublicSongController,
} = require("../../controller/music/songs.controller.js");
const {
  checkAdminMiddleware,
  authMiddleware,
} = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicSongsController)
  .post(authMiddleware, checkAdminMiddleware, addSongController);

router.route("/:songId").get(getPublicSongController);

module.exports = router;
