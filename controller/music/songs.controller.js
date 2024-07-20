const fs = require("node:fs");

const path = require("node:path");
const {
  errorResponseHandler,
  successResponseHandler,
} = require("../../handler/responseHandler.js");

const {
  extractExtensionFromString,
  generateRandomId,
} = require("../../helpers/utils.js");
const prisma = require("../../config/db.js");
const { formidable } = require("formidable");

const uploadFolder = path.join("public", "uploads", "music");

const filesJsonPath = uploadFolder + "/index.json";

function addFileToJson(parsedFilesObj) {
  const files = Object.values(parsedFilesObj).map((file) => {
    return {
      filepath: file[0]?.filepath || "",
      fileName: file[0]?.newFilename || "",
      originalFilename: file[0]?.originalFilename || "",
      mimetype: file[0]?.mimetype || "",
      size: file[0]?.size || "",
    };
  });

  fs.readFile(filesJsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log("First errr");
      return;
    }

    const obj = JSON.parse(data || "{}");
    if (!Array.isArray(obj?.songs)) {
      obj.songs = [];
    }
    obj.songs = obj.songs.concat(...files);

    const json = JSON.stringify(obj);

    fs.writeFile(
      filesJsonPath,
      json,
      { flag: "wx", encoding: "utf-8" },
      (err) => {
        if (err) {
          // console.log("thirid error");
          return;
        }
        console.log("added too file", json);
      }
    ); // write it back
  });
}

module.exports.addSongController = async function (req, res) {
  try {
    const form = formidable({
      multiples: true,
      uploadDir: uploadFolder,
      maxFileSize: 100 * 1024 * 1024, // 10MB
      filename: (name, _, part) => {
        const { originalFilename } = part;
        const ext = extractExtensionFromString(originalFilename);

        return name.concat("_", generateRandomId(), ".", ext);
      },
      allowEmptyFiles: false,
      maxFiles: 6,
      keepExtensions: true,
      createDirsFromUploads: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) throw new Error(err);
      // console.log("Parsed", files);
      // files.forEach;
      addFileToJson(files);

      res.json({ message: "hell", fields, files });
    });
  } catch (err) {
    console.log(err);
    return errorResponseHandler(res, 500, err);
  }
};

module.exports.getPublicSongsController = async function (request, reply) {
  try {
    // const publicSongs = await prisma.songs.findMany();
    fs.readFile(filesJsonPath, "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log("First errr");
        return;
      }

      const obj = JSON.parse(data || "{}");

      successResponseHandler(reply, obj);
    });
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};
