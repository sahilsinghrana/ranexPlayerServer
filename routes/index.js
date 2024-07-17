const router = require("express").Router();

const { successResponseHandler } = require("../handler/responseHandler.js");
const authRoutes = require("./auth.js");
const musicRoutes = require("./music/index.js");

router.use(authRoutes);
router.use("/music", musicRoutes);
router.get("/", async (request, response) => {
  successResponseHandler(response, { hello: "world" });
});

module.exports = router;
