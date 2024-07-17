const router = require("express").Router();

const {
  addPublicPlaylistController,
  addSongToUserPlaylist,
  addUserPlaylist,
  getAllUserPlaylists,
  getPublicPlaylistsConstroller,
  removePlaylist,
  removeSongFromUserPlaylist,
  reorderSongInUserPlaylist,
  updateUserPlaylist,
} = require("../../controller/music/playlist.js");

const {
  authMiddleware,
  checkAdminMiddleware,
} = require("../../hooks/auth.hook.js");

router.get("/", getPublicPlaylistsConstroller);
router.post("/", checkAdminMiddleware, addPublicPlaylistController);

router.get("/user", authMiddleware, getAllUserPlaylists);
router.post("/user", authMiddleware, addUserPlaylist);
router.delete("/user", authMiddleware, removePlaylist);

router.post("/user/update", authMiddleware, updateUserPlaylist);

router.post("/user/update/song", authMiddleware, addSongToUserPlaylist);
router.delete("/user/update/song", authMiddleware, removeSongFromUserPlaylist);
router.patch("/user/update/song", authMiddleware, reorderSongInUserPlaylist);

module.exports = router;
