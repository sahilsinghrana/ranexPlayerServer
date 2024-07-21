const prisma = require("../config/db.js");

module.exports.addPublicSongToDB = async function ({
  createdBy,
  filePath,
  title,
}) {
  return await prisma.songs.create({
    data: {
      created_by: createdBy,
      path: filePath,
      title: title,
    },
  });
};

module.exports.uploadSong = async function (song) {
  return {
    url: "",
    id: "",
  };
};
