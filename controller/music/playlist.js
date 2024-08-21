const prisma = require("../../config/db.js");

const {
  errorResponseHandler,
  successResponseHandler,
} = require("../../handler/responseHandler.js");

const { getUserIdFromUserObj } = require("../../helpers/auth.helpers.js");
const {
  addPublicPlaylist,
  getPublicPlaylists,
  getPlaylistById,
} = require("../../helpers/playlist.helpers.js");
const { getSongById } = require("../../helpers/songs.helper.js");
const { isUserAdmin } = require("../../middlewares/auth.hook.js");

module.exports.getPublicPlaylistsConstroller = async function (request, reply) {
  try {
    const allPublicPlaylists = await getPublicPlaylists();
    successResponseHandler(reply, allPublicPlaylists);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.addPublicPlaylistController = async function (req, res) {
  const userId = getUserIdFromUserObj(req.user);

  const { playlistName } = req.body;

  if (!playlistName) throw new Error("Playlist Name is required");
  try {
    const addedPlaylist = await addPublicPlaylist({
      title: playlistName,
      userId,
    });
    successResponseHandler(res, addedPlaylist);
  } catch (err) {
    // TODO create new error class with http status codes
    errorResponseHandler(res, err.status || 500, err);
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

module.exports.removePlaylist = async function (req, res) {
  try {
    const { playlistId } = req.params;
    const userId = getUserIdFromUserObj(req.user);
    if (!playlistId) throw new Error("playlistId is required");

    const whereCondition = {
      id: playlistId,
    };
    if (!isUserAdmin(req.user)) {
      whereCondition.created_by = userId;
    }
    const updatedPlaylist = await prisma.playlists.delete({
      where: whereCondition,
    });
    successResponseHandler(res, updatedPlaylist);
  } catch (err) {
    console.log(err);
    errorResponseHandler(res, 500, err);
  }
};

module.exports.getPlaylistSongsController = async function (req, res) {
  const { playlistId } = req.params;
  try {
    if (!playlistId) throw new Error("playlistId is required");
    const songs = await prisma.playlists_songs.findMany({
      where: {
        playlist_id: playlistId,
      },
      include: {
        songs: true,
      },
    });
    successResponseHandler(res, songs);
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
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

module.exports.addSongToPublicPlaylistController = async function (req, res) {
  try {
    const { playlistId, songId } = req.params;

    if (!playlistId || !songId)
      throw new Error("playlistId and songId are required");
    const playlist = await getPlaylistById(playlistId);
    if (!playlist) throw new Error("Playlist not found");
    const song = await getSongById(songId);
    if (!song) throw new Error("Song not found");

    const playlistSong = await prisma.playlists_songs.findFirst({
      where: {
        playlist_id: playlistId,
        song_id: songId,
      },
    });
    if (playlistSong) throw new Error("Song already exists in playlist");

    const linkedSong = await prisma.playlists_songs.create({
      data: {
        playlist_id: playlist.id,
        song_id: song.id,
      },
    });

    successResponseHandler(res, linkedSong);
  } catch (err) {
    errorResponseHandler(res, 500, err);
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

module.exports.getPublicPlaylistByIdController = async function (req, res) {
  try {
    const { playlistId } = req.params;
    if (!playlistId) throw new Error("playlistId is required");

    const whereCondition = {
      id: playlistId,
    };
    const foundPlaylist = await prisma.playlists.findFirst({
      where: whereCondition,
    });
    successResponseHandler(res, foundPlaylist);
  } catch (err) {
    console.log(err);
    errorResponseHandler(res, 500, err);
  }
};
