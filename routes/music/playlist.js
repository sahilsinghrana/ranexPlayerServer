const router = require("express").Router();

const {
  addPublicPlaylistController,
  getPublicPlaylistsConstroller,
} = require("../../controller/music/playlist.js");

const { checkAdminMiddleware } = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicPlaylistsConstroller)
  .post(checkAdminMiddleware, addPublicPlaylistController);

module.exports = router;
