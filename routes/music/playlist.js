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
  fastify.post("/user",{
    schema: {
      description: 'Add User Playlist',
      tags: ['playlist', 'user'],
      summary: 'Adds user Playlist',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'user id'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
          obj: {
            type: 'object',
            properties: {
              some: { type: 'string' }
            }
          }
        }
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        },
        default: {
          description: 'Default response',
          type: 'object',
          properties: {
            foo: { type: 'string' }
          }
        }
      },
      security: [
        {
          "apiKey": []
        }
      ]
    }
  },  addUserPlaylist);
  fastify.delete("/user", removePlaylist);

  fastify.post("/user/update", updateUserPlaylist);
  fastify.post("/user/update/song", addSongToUserPlaylist);
  fastify.delete("/user/update/song", removeSongFromUsrePlaylist);
  fastify.patch("/user/update/song", reorderSongInUserPlaylist);
}

export default playlistRoutes;
