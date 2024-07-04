import { authMiddleware, verifyAccessTokenHook } from "../hooks/auth.hook.js";
import { privatePlaylistRoutes } from "./music/playlist.js";

async function privateRoutes(fastify) {
  fastify.addHook("preHandler", verifyAccessTokenHook);
  fastify.addHook("preHandler", authMiddleware);

  fastify.register(privatePlaylistRoutes, {
    prefix: "/music",
  });
}

export default privateRoutes;
