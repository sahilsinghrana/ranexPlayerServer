const router = require("express").Router();
const { verifyAccessTokenHook } = require("../hooks/auth.hook.js");
const { publicPlaylistRoutes } = require("./music/playlist.js");

fastify.use("/music", verifyAccessTokenHook, publicPlaylistRoutes);

module.exports = router;
