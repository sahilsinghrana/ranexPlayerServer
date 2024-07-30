const {
  getAllUserPlaylists,
  addUserPlaylist,
  removePlaylist,
  updateUserPlaylist,
  addSongToUserPlaylist,
  removeSongFromUserPlaylist,
  reorderSongInUserPlaylist,
} = require("../../controller/music/playlist");

const router = require("express").Router();

router
  .route("/")
  .get(getAllUserPlaylists)
  .post(addUserPlaylist)
  .delete(removePlaylist)
  .patch(updateUserPlaylist);

router.post("/song", addSongToUserPlaylist);
router.delete("/song", removeSongFromUserPlaylist);
router.patch("/song", reorderSongInUserPlaylist);

module.exports = router;
