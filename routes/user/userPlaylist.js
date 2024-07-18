const {
  getAllUserPlaylists,
  addUserPlaylist,
  removePlaylist,
  updateUserPlaylist,
  addSongToUserPlaylist,
  removeSongFromUserPlaylist,
  reorderSongInUserPlaylist,
} = require("../../controller/music/playlist");
const { authMiddleware } = require("../../middlewares/auth.hook");

const router = require("express").Router();

router
  .route("/")
  .get(authMiddleware, getAllUserPlaylists)
  .post(authMiddleware, addUserPlaylist)
  .delete(authMiddleware, removePlaylist)
  .patch(authMiddleware, updateUserPlaylist);

router.post("/song", authMiddleware, addSongToUserPlaylist);
router.delete("/song", authMiddleware, removeSongFromUserPlaylist);
router.patch("/song", authMiddleware, reorderSongInUserPlaylist);

module.exports = router;
