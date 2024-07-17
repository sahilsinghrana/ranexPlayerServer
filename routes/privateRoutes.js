const router = require("express").Router();
const {
  authMiddleware,
  verifyAccessTokenHook,
} = require("../hooks/auth.hook.js");
const { privatePlaylistRoutes } = require("./music/playlist.js");

router.use(
  "/music",
  verifyAccessTokenHook,
  authMiddleware,
  privatePlaylistRoutes
);

module.exports = router;
