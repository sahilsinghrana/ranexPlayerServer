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

import { authMiddleware, checkAdminMiddleware } from "../../hooks/auth.hook.js";

async function playlistRoutes(fastify) {
  fastify.get("/", getPublicPlaylistsConstroller);
  fastify.route({
    method: "POST",
    url: "/",
    handler: addPublicPlaylistController,
    onRequest: checkAdminMiddleware,
  });

  fastify.register(async (privateFastify) => {
    privateFastify.addHook("preHandler", authMiddleware);

    privateFastify.get("/user", getAllUserPlaylists);
    privateFastify.post("/user", addUserPlaylist);
    privateFastify.delete("/user", removePlaylist);

    privateFastify.post("/user/update", updateUserPlaylist);

    privateFastify.post("/user/update/song", addSongToUserPlaylist);
    privateFastify.delete("/user/update/song", removeSongFromUserPlaylist);
    privateFastify.patch("/user/update/song", reorderSongInUserPlaylist);
  });
}

function privateRoutes(privateFastify) {}

export default playlistRoutes;
