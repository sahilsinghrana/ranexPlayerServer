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
const {
  songsResponseFactory,
  addPublicSongToDB,
  deletePublicSongFromDB,
} = require("../../helpers/songs.helper.js");

const uploadFolder = path.join("public", "uploads", "music");

async function addFileToJson(parsedFilesObj) {
  return new Promise(async (resolve, reject) => {
    const song = parsedFilesObj.song;
    const meta = parsedFilesObj.meta;
    const uploadedBy = parsedFilesObj.uploadedBy;

    try {
      const [res, updateDbWithCloudinaryResponse] = await addPublicSongToDB({
        meta,
        uploadedBy,
      });
      try {
        const cloudinaryResponse = await cloudinaryUploader(song);
        try {
          const updatedRes =
            await updateDbWithCloudinaryResponse(cloudinaryResponse);
          resolve(updatedRes);
        } catch (err) {
          cloudinaryDestroyer(cloudinaryResponse?.public_id);
          throw new Error(err);
        }
      } catch (err) {
        deletePublicSongFromDB(res.id);
        throw new Error(err);
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports.addSongController = function (req, res) {
  const userID = getUserIdFromUserObj(req.user);
  try {
    const form = formidable({
      multiples: false,
      uploadDir: uploadFolder,
      maxFileSize: 100 * 1024 * 1024, // 10MB
      filename: (name, _, part) => {
        const { originalFilename } = part;
        const ext = extractExtensionFromString(originalFilename);

        return encodeURIComponent(
          name
            .replace(/\s+/g, "_")
            .replace(/[^\w\s]/g, "")
            .concat("_", generateRandomId(), ".", ext),
        );
      },
      allowEmptyFiles: false,
      maxFiles: 6,
      keepExtensions: true,
      createDirsFromUploads: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) throw new Error(err);
      if (!Array.isArray(fields.meta)) throw new Error("MetaData not provided");
      if (!Array.isArray(files?.file)) throw new Error("Song Required");

      let meta = fields.meta;
      const metaStr = meta[0];
      try {
        meta = JSON.parse(metaStr);
      } catch (err) {
        throw new Error("Invalid Meta");
      }

      const songFile = files?.file?.[0];
      if (!songFile) throw new Error("Song Required");
      const processedFileData = {
        song: songFile,
        meta: meta,
        uploadedBy: userID,
      };
      try {
        await addFileToJson(processedFileData);
        successResponseHandler(res, { message: "Uploaded Successfully!" });
      } catch (err) {
        return errorResponseHandler(res, 500, err);
      }
    });
  } catch (err) {
    return errorResponseHandler(res, 500, err);
  }
};

module.exports.getPublicSongsController = async function (req, res) {
  try {
    const songs = await prisma.songs.findMany();
    return successResponseHandler(res, {
      songs: songs.map(songsResponseFactory),
    });
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};

module.exports.getPublicSongController = async function (req, res) {
  const songId = req.params.songId;
  try {
    successResponseHandler(res, { message: "HOla", songId });
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};

function cloudinaryUploader(song) {
  return new Promise((resolve, reject) => {
    storage.uploader.upload_large(
      song.filepath,
      {
        resource_type: "raw",
        access_mode: "authenticated",
        folder: "ranexPlayer",
        use_filename: true,
        type: "authenticated",
        categorization: "google_tagging",
        auto_tagging: 0.6,
      },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      },
    );
  });
}

async function cloudinaryDestroyer(public_id, options = {}) {
  console.log({ public_id });
  return new Promise((resolve, reject) => {
    storage.uploader.destroy(
      public_id,
      {
        resource_type: "raw",
        type: "authenticated",
        ...options,
      },
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      },
    );
  });
}

module.exports.publicSongDeleteController = async function (req, res) {
  try {
    const { songId } = req.params;
    console.log({ songId });
    await prisma.songs
      .findFirst({
        where: {
          id: songId,
        },
      })
      .then((song) => {
        console.log("song found");
        if (song) {
          return song;
        }
        throw new Error("Song not found");
      })
      .then((song) => {
        const { cloudinary = {} } = song;
        const { public_id } = cloudinary;
        return cloudinaryDestroyer(public_id);
      })
      .then((res) => {
        if (res?.result === "ok") {
          return prisma.songs.delete({
            where: {
              id: songId,
            },
          });
        }
      })
      .then(() => {
        successResponseHandler(res);
      })
      .catch((err) => {
        console.log(err);
        errorResponseHandler(res, 500, err);
      });
  } catch (err) {
    console.log(err);
    errorResponseHandler(res, 500, err);
  }
};

module.exports.searchSongController = async function (req, res) {
  try {
    const { q } = req.query;
    const songs = await prisma.songs.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            artist: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return successResponseHandler(res, {
      songs: songs.map(songsResponseFactory),
    });
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};
