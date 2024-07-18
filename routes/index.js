const router = require("express").Router();

const supabase = require("../config/supabase.js");
const { successResponseHandler } = require("../handler/responseHandler.js");
const {
  verifyAccessToken,
  authMiddleware,
} = require("../middlewares/auth.hook.js");

const authRoutes = require("./auth.js");
const musicRoutes = require("./music/index.js");
const userRoutes = require("./user/index.js");

router.use(verifyAccessToken, authRoutes);
router.use("/music", verifyAccessToken, musicRoutes);
router.use("/user", authMiddleware, userRoutes);

router.get("/", async (request, response) => {
  successResponseHandler(response, { hello: "world" });
});

module.exports = router;
