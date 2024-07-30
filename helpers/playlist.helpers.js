const prisma = require("../config/db.js");

module.exports.getPublicPlaylists = async function () {
  return await prisma.playlists.findMany();
};

module.exports.addPublicPlaylist = async function ({ title, userId }) {
  return await prisma.playlists.create({
    data: {
      title: title,
      isPublic: true,
      created_by: userId,
    },
  });
};
