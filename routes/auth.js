import supabase from "../config/supabase.js";

import {
  loginController,
  signupController,
} from "../controller/auth.controller.js";

async function authRoutes(fastify) {
  fastify.post("/login", loginController);
  fastify.post("/signup", signupController);
  fastify.get("/auth/callback", async (req, reply) => {
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
}

export default authRoutes;
