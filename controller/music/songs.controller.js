const util = require("node:util");
const { pipeline } = require("node:stream");
const fs = require("node:fs");

const pump = util.promisify(pipeline);

const {
  errorResponseHandler,
  successResponseHandler,
} = require("../../handler/responseHandler.js");
const { addPublicSong } = require("../../helpers/songs.helper.js");
const {
  extractExtensionFromString,
  generateRandomId,
} = require("../../helpers/utils.js");
const { getUserIdFromUserObj } = require("../../helpers/auth.helpers.js");
const prisma = require("../../config/db.js");

async function saveSong(part) {
  const fileName = part.filename;
  const ext = extractExtensionFromString(fileName);

  const randomFileName = generateRandomId().concat(".", ext);

  const filePath = `./uploads/${randomFileName}`;
  await pump(part.file, fs.createWriteStream(filePath));
  return filePath;
}

module.exports.addSongController = async function (request, reply) {
  try {
    let filePath, title;

    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file") {
        console.log("GOT a file");
        filePath = await saveSong(part);
      } else {
        if (
          part?.fields?.title &&
          part.mimetype === "text/plain" &&
          part?.fields?.title?.value
        ) {
          title = await part?.fields?.title?.value;
        }
      }
    }
    // TODO - Validate and move file to assets folder and then later add it to db
    if (filePath && title) {
      const userId = getUserIdFromUserObj(request.user);
      const addedSong = await addPublicSong({
        filePath: filePath,
        title: title,
        createdBy: userId,
      });
      return successResponseHandler(reply, addedSong);
    } else {
      return errorResponseHandler(reply, 400, "title and file is required");
    }
  } catch (err) {
    return errorResponseHandler(reply, 500, err);
  }
};

module.exports.getPublicSongsController = async function (request, reply) {
  try {
    const publicSongs = await prisma.songs.findMany();
    successResponseHandler(reply, publicSongs);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};
