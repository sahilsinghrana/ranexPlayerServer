const router = require("express").Router();

const {
  loginController,
  signupController,
  logoutController,
} = require("../controller/auth.controller.js");

router.post("/login", loginController);
router.post("/signup", signupController);
router.get("/logout", logoutController);

module.exports = router;
