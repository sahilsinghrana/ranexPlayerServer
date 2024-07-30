const prisma = require("../../config/db.js");

const {
  errorResponseHandler,
  successResponseHandler,
} = require("../../handler/responseHandler.js");

const { getUserIdFromUserObj } = require("../../helpers/auth.helpers.js");
const {
  addPublicPlaylist,
  getPublicPlaylists,
} = require("../../helpers/playlist.helpers.js");
const { checkAdminMiddleware } = require("../../middlewares/auth.hook.js");

module.exports.getPublicPlaylistsConstroller = async function (request, reply) {
  try {
    const allPublicPlaylists = await getPublicPlaylists();
    successResponseHandler(reply, allPublicPlaylists);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.addPublicPlaylistController = async function (request, reply) {
  checkAdminMiddleware(request, reply);
  const userId = getUserIdFromUserObj(request.user);

  const { title } = request.body;
  try {
    const addedPlaylist = await addPublicPlaylist({
      title,
      userId,
    });
    successResponseHandler(reply, addedPlaylist);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.getAllUserPlaylists = async function (request, reply) {
  try {
    const userId = getUserIdFromUserObj(request.user);

    const userPlaylists = await prisma.user_playlists.findMany({
      where: {
        created_by: userId,
      },
    });
    successResponseHandler(reply, userPlaylists);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.addUserPlaylist = async function (request, reply) {
  const { title } = request.body;
  const userId = getUserIdFromUserObj(request.user);
  try {
    const createdPlaylist = await prisma.user_playlists.create({
      data: {
        title,
        user_id: userId,
        created_by: userId,
      },
    });
    successResponseHandler(reply, createdPlaylist);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.removePlaylist = async function (request, reply) {
  try {
    const { playlistId } = request.body;
    if (!playlistId) throw new Error("playlistId is required");
    const userId = getUserIdFromUserObj(request.user);
    const updatedPlaylist = await prisma.user_playlists.delete({
      where: {
        created_by: userId,
        id: playlistId,
      },
    });
    successResponseHandler(reply, updatedPlaylist);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.getSongsFromPlaylist = function () {
  return "Retrieving songs from playlist";
};

module.exports.updateUserPlaylist = async function (request, reply) {
  try {
    const { title, playlistId } = request.body;
    if (!playlistId) throw new Error("playlistId is required");
    const userId = getUserIdFromUserObj(request.user);

    const updatedPlaylist = await prisma.user_playlists.update({
      where: {
        created_by: userId,
        id: playlistId,
      },
      data: {
        title: title,
      },
    });
    successResponseHandler(reply, updatedPlaylist);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.addSongToUserPlaylist = function () {
  return "adding song playlist";
};

module.exports.removeSongFromUserPlaylist = function () {
  return "removing song playlist";
};

module.exports.reorderSongInUserPlaylist = function () {
  return "reordering song playlist";
};
