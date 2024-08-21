const prisma = require("../config/db.js");
const prismaErrorHandler = require("../handler/prismaErrorHandler.js");

module.exports.getPublicPlaylists = async function () {
  return await prisma.playlists.findMany();
};

module.exports.addPublicPlaylist = async function ({ title, userId }) {
  try {
    const playlist = await prisma.playlists.create({
      data: {
        title: title,
        created_by: userId,
      },
    });
    return playlist;
  } catch (err) {
    prismaErrorHandler(err);
  }
};

module.exports.getPlaylistById = async function (playlistId) {
  try {
    const playlist = await prisma.playlists.findUnique({
      where: {
        id: playlistId,
      },
    });
    return playlist;
  } catch (err) {
    prismaErrorHandler(err);
  }
};
