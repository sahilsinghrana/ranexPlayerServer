const router = require("express").Router();

const db = require("../../config/db.js");
// const streamController = require("../../controller/music/stream.js");
const {
  errorResponseHandler,
  successResponseHandler,
} = require("../../handler/responseHandler.js");
const playlistRoutes = require("./playlist.js");
const songRoutes = require("./songs.js");

router.use("/playlist", playlistRoutes);
router.use("/song", songRoutes);

router.get("/", (request, reply) => {
  successResponseHandler(reply, { hello: "music routes" });
});

router.post("/albums", async (request, reply) => {
  const { title } = request.body;
  try {
    const record = await db.albums.create({
      data: {
        title: title,
        created_at: new Date(),
      },
    });

    successResponseHandler(reply, record);
  } catch (err) {
    errorResponseHandler(reply, 400, err);
  }
});

router.get("/albums", async (request, reply) => {
  const albums = await db.albums.findMany();
  return successResponseHandler(reply, {
    albums,
  });
});

module.exports = router;
