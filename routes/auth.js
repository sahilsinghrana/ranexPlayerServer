const router = require("express").Router();

const {
  loginController,
  signupController,
  logoutController,
} = require("../controller/auth.controller.js");
const { verifyAccessToken } = require("../middlewares/auth.hook.js");

router.post("/login", verifyAccessToken, loginController);
router.post("/signup", verifyAccessToken, signupController);
router.get("/logout", verifyAccessToken, logoutController);

module.exports = router;
