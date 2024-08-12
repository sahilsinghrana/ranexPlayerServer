const router = require("express").Router();

const {
  verifyAccessToken,
  authMiddleware,
} = require("../middlewares/auth.hook.js");

const authRoutes = require("./auth.js");
const musicRoutes = require("./music/index.js");
const userRoutes = require("./user/index.js");

router.get("/", async (_, res) => res.status(200).send());

router.use("/music", verifyAccessToken, musicRoutes);
router.use("/user", verifyAccessToken, authMiddleware, userRoutes);

router.use(verifyAccessToken, authRoutes);

module.exports = router;
