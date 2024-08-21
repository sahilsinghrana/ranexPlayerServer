const router = require("express").Router();

const {
  addSongController,
  getPublicSongsController,
  getPublicSongController,
  publicSongDeleteController,
  searchSongController,
} = require("../../controller/music/songs.controller.js");
const {
  checkAdminMiddleware,
  authMiddleware,
} = require("../../middlewares/auth.hook.js");

router.get("/search", searchSongController);

router
  .route("/")
  .get(getPublicSongsController)
  .post(authMiddleware, checkAdminMiddleware, addSongController);

router
  .route("/:songId")
  .get(getPublicSongController)
  .delete(checkAdminMiddleware, publicSongDeleteController);

module.exports = router;
