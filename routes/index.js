const router = require("express").Router();

const {
  verifyAccessToken,
  authMiddleware,
} = require("../middlewares/auth.hook.js");

const authRoutes = require("./auth.js");
const musicRoutes = require("./music/index.js");
const userRoutes = require("./user/index.js");

router.use("/music", verifyAccessToken, musicRoutes);
router.use("/user", verifyAccessToken, authMiddleware, userRoutes);

router.get("/", async (request, response) => {
  response.status(200).json({
    hello: "world",
  });
});
router.use(verifyAccessToken, authRoutes);

module.exports = router;
