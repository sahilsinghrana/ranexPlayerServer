import { verifyAccessTokenHook } from "../hooks/auth.hook.js";
import { publicPlaylistRoutes } from "./music/playlist.js";

async function publicRoutes(fastify) {
  fastify.addHook("preHandler", verifyAccessTokenHook);

  fastify.register(publicPlaylistRoutes, {
    prefix: "/music",
  });
}

export default publicRoutes;
