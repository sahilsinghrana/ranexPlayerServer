const prisma = require("../config/db.js");

module.exports.addPublicSongToDB = async function ({ meta, uploadedBy }) {
  try {
    const res = await prisma.songs.create({
      data: {
        title: meta.title,
        created_by: uploadedBy,
        artist: meta.artist,
        year: meta.year,
        album: meta.album,
        musicbrainz: meta.musicBrainz,
      },
    });
    const updateResponse = async function (cloudinaryResponse) {
      const path = cloudinaryResponse?.secure_url;
      if (!cloudinaryResponse || !path)
        throw new Error("Inavlid Cloudinary response");
      const finalRes = await prisma.songs.update({
        where: {
          id: res.id,
        },
        data: {
          path: path,
          cloudinary: cloudinaryResponse,
        },
      });
      return finalRes;
    };
    return [res, updateResponse];
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports.deletePublicSongFromDB = async function (songId) {
  return await prisma.songs.delete({
    where: {
      id: songId,
    },
  });
};

module.exports.uploadSong = async function (song) {
  return {
    url: "",
    id: "",
  };
};

module.exports.songsResponseFactory = function (song) {
  const musicBrainz = song?.musicbrainz || {};
  const coverArt = musicBrainz?.coverArt || {};
  return {
    title: song.title,
    year: song.year,
    album: song.album,
    artist: song.artist,
    songId: song.id,
    path: song.path,
    coverArt: {
      image: coverArt.image,
      thumbnails: coverArt.thumbnails || {},
    },
    duration: musicBrainz.duration,
    releaseID: musicBrainz.releaseID,
    recordingID: musicBrainz.recordingID,
    releaseDate: musicBrainz.releaseDate,
  };
};
