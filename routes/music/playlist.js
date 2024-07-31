const router = require("express").Router();

const {
  addPublicPlaylistController,
  getPublicPlaylistsConstroller,
  removePlaylist,
} = require("../../controller/music/playlist.js");

const { checkAdminMiddleware } = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicPlaylistsConstroller)
  .post(checkAdminMiddleware, addPublicPlaylistController);

router.route("/:playlistId").delete(checkAdminMiddleware, removePlaylist);

module.exports = router;
