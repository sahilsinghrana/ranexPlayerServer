import {
  addPublicPlaylistController,
  addSongToUserPlaylist,
  addUserPlaylist,
  getAllUserPlaylists,
  getPublicPlaylistsConstroller,
  removePlaylist,
  removeSongFromUsrePlaylist,
  reorderSongInUserPlaylist,
  updateUserPlaylist,
} from "../../controller/music/playlist.js";

async function playlistRoutes(fastify) {
  fastify.get("/", getPublicPlaylistsConstroller);
  fastify.post("/", addPublicPlaylistController)


  fastify.get("/user", getAllUserPlaylists);
  fastify.post("/user",  addUserPlaylist);
  fastify.delete("/user", removePlaylist);

  fastify.post("/user/update", updateUserPlaylist);
  fastify.post("/user/update/song", addSongToUserPlaylist);
  fastify.delete("/user/update/song", removeSongFromUsrePlaylist);
  fastify.patch("/user/update/song", reorderSongInUserPlaylist);
}

export default playlistRoutes;
