import {
  addPublicPlaylistController,
  addSongToUserPlaylist,
  addUserPlaylist,
  getAllUserPlaylists,
  getPublicPlaylistsConstroller,
  removePlaylist,
  removeSongFromUserPlaylist,
  reorderSongInUserPlaylist,
  updateUserPlaylist,
} from "../../controller/music/playlist.js";

import { checkAdminMiddleware } from "../../hooks/auth.hook.js";

async function playlistRoutes(fastify) {
  fastify.get("/", getPublicPlaylistsConstroller);
  
  fastify.route({
    method : "POST",
    url :"/",
    handler : addPublicPlaylistController,
    onRequest : checkAdminMiddleware
  })

  fastify.get("/user", getAllUserPlaylists);
  fastify.post("/user",  addUserPlaylist);
  fastify.delete("/user", removePlaylist);

  fastify.post("/user/update", updateUserPlaylist);

  fastify.post("/user/update/song", addSongToUserPlaylist);
  fastify.delete("/user/update/song", removeSongFromUserPlaylist);
  fastify.patch("/user/update/song", reorderSongInUserPlaylist);
}

export default playlistRoutes;
