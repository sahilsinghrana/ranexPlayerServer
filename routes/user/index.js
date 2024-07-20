const router = require("express").Router();

const supabase = require("../../config/supabase");
const { successResponseHandler } = require("../../handler/responseHandler");
const { extractUserProfile } = require("../../helpers/user");
const userPlaylistRoutes = require("./userPlaylist");

router.use("/playlist", userPlaylistRoutes);

router.get("/profile", (req, res) => {
  const user = req.user;
  const userProfile = extractUserProfile(user);
  successResponseHandler(res, userProfile);
});

module.exports = router;
