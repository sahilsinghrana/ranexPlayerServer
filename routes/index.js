import { successResponseHandler } from "../handler/responseHandler.js";
import { verifyAccessTokenHook } from "../hooks/auth.hook.js";
import authRoutes from "./auth.js";
import musicRoutes from "./music/index.js";

async function routes(fastify) {
  // fastify.addHook('preHandler', verifyAccessTokenHook)

  fastify.register(authRoutes);
  fastify.register(musicRoutes, {
    prefix: "/music",
  });
  fastify.get("/", async (request, reply) => {
    successResponseHandler(reply, { hello: "world" });
  });
}

export default routes;
