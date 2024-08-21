const router = require("express").Router();

const {
  addPublicPlaylistController,
  getPublicPlaylistsConstroller,
  removePlaylist,
  getPublicPlaylistByIdController,
  addSongToPublicPlaylistController: addSongToPlaylistController,
  getPlaylistSongsController,
} = require("../../controller/music/playlist.js");

const { checkAdminMiddleware } = require("../../middlewares/auth.hook.js");

router
  .route("/")
  .get(getPublicPlaylistsConstroller)
  .post(checkAdminMiddleware, addPublicPlaylistController);

router
  .route("/:playlistId")
  .get(getPublicPlaylistByIdController)
  .delete(checkAdminMiddleware, removePlaylist);

router.get("/songs/:playlistId", getPlaylistSongsController);

router.post("/:playlistId/:songId", addSongToPlaylistController);

module.exports = router;
