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

router.get("/auth/callback", async (req, res) => {
  // NOTE - this does nothing
  const code = req.query.code;
  // const next = req.query.next ?? "/";
  // console.log({
  //   code,
  //   cookie: req.cookies,
  // });

  try {
    if (code) {
      console.log("Exchanging code", req.query);
      const session = await supabase.auth.exchangeCodeForSession(code);
      console.log("SessionREcieved", session);
    }
  } catch (err) {
    console.log(err);
  }

  res.cookie("hell", "val");

  // reply.redirect(`http://127.0.0.1:5173/`, 303);
  res.redirect("https://turbo-guacamole-9jxqp6xpp67hx447-5173.app.github.dev/");
});

router.use(verifyAccessToken, authRoutes);
router.use("/music", verifyAccessToken, musicRoutes);
router.use("/user", authMiddleware, userRoutes);

router.get("/", async (request, response) => {
  successResponseHandler(response, { hello: "world" });
});

module.exports = router;
