const router = require("express").Router();
const supabase = require("../config/supabase.js");

const {
  loginController,
  signupController,
} = require("../controller/auth.controller.js");

router.post("/login", loginController);
router.post("/signup", signupController);
router.get("/auth/callback", async (req, reply) => {
  const code = req.query.code;
  const next = req.query.next ?? "/";
  console.log("hits callback", {
    code,
    next,
  });
  if (code) {
    console.log("Exchanging code");
    const session = await supabase.auth.exchangeCodeForSession(code);
    console.log("SessionREcieved", session);
  }
  reply.header("set-cookie", "bar");
  // reply.redirect(`http://127.0.0.1:5173/`, 303);
});

module.exports = router;
