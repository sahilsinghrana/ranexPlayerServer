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
const storage = require("../../config/cloudinary.js");
const { getUserIdFromUserObj } = require("../../helpers/auth.helpers.js");

const uploadFolder = path.join("public", "uploads", "music");

const filesJsonPath = uploadFolder + "/index.json";

async function addFileToJson(parsedFilesObj) {
  console.log(parsedFilesObj);
  return;
  return Promise.all(
    Object.values(parsedFilesObj).map((file) => {
      return new Promise((resolve, reject) => {
        storage.uploader.upload_large(
          file[0]?.filepath,
          {
            resource_type: "auto",
            access_mode: "authenticated",
            folder: "ranexPlayer",
            use_filename: true,
          },
          (err, res) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            console.log(res);
            resolve(res);
          }
        );
      });
    })
  );
  return;
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

module.exports.addSongController = function (req, res) {
  console.log({
    user: req.user,
  });
  const userID = getUserIdFromUserObj(req.user);
  try {
    const form = formidable({
      multiples: true,
      uploadDir: uploadFolder,
      maxFileSize: 100 * 1024 * 1024, // 10MB
      filename: (name, _, part) => {
        const { originalFilename } = part;
        const ext = extractExtensionFromString(originalFilename);

        return encodeURIComponent(
          name
            .replace(/\s+/g, "_")
            .replace(/[^\w\s]/g, "")
            .concat("_", generateRandomId(), ".", ext)
        );
      },
      allowEmptyFiles: false,
      maxFiles: 6,
      keepExtensions: true,
      createDirsFromUploads: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) throw new Error(err);
      // console.log("Parsed", files);
      // files.forEach;
      console.log({
        fields,
        files,
      });

      const processedFileData = Object.entries(files).map(([key, values]) => {
        const songFile = values[0];
        const albumArt = values[1];
        let meta = fields[key.concat(".", "meta")];
        if (Array.isArray(meta)) {
          const metaStr = meta[0];
          try {
            meta = JSON.parse(metaStr);
          } catch (err) {
            console.log("Invalid Meta");
          }
        }
        return {
          song: songFile,
          albumArt: albumArt,
          meta: meta,
          uploadedBy: userID,
        };
      });

      await addFileToJson(processedFileData);

      res.json({ message: "hell", fields, files });
    });
  } catch (err) {
    console.log(err);
    return errorResponseHandler(res, 500, err);
  }
};

module.exports.getPublicSongsController = async function (req, res) {
  try {
    return successResponseHandler(res, {
      songs: [
        {
          title: "Kun Faaya Kun",
          artist: "A.R Rahman, Mohit Chauhan",
          album: "Rockstar",
        },
        {
          title: "In My Time",
          artist: "Europe",
          album: "Last look at Eden",
        },
        {
          title: "Still Loving You",
          artist: "Scorpions",
          album: "Comeblack",
        },
      ],
    });
    // const publicSongs = await prisma.songs.findMany();
    fs.readFile(filesJsonPath, "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log("First errr");
        errorResponseHandler(res, 500, {
          songs: [],
        });
        return;
      }

      const obj = JSON.parse(data || "{}");

      successResponseHandler(res, obj);
    });
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};
