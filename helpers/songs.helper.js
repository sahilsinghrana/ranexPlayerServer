const prisma = require("../config/db.js");

module.exports.addPublicSong = async function ({ createdBy, filePath, title }) {
  return await prisma.songs.create({
    data: {
      created_by: createdBy,
      path: filePath,
      title: title,
    },
  });
};
