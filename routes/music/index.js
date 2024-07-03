import db from "../../config/db.js";
import streamController from "../../controller/music/stream.js";
import {
  errorResponseHandler,
  successResponseHandler,
} from "../../handler/responseHandler.js";
import { authMiddleware } from "../../hooks/auth.hook.js";
import playlistRoutes from "./playlist.js";
import songRoutes from "./songs.js";

async function musicRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware)

  fastify.register(playlistRoutes, { prefix: "/playlist" });
  fastify.register(songRoutes, { prefix: "/song" });

  fastify.get("/", async (request, reply) => {
    return { hello: "music routes" };
  });

  fastify.post("/albums", async (request, reply) => {
    const { title } = request.body;
    try {
      const record = await db.albums.create({
        data: {
          title: title,
          created_at: new Date(),
        },
      });

      successResponseHandler(reply, record);
    } catch (err) {
      errorResponseHandler(reply, 400, err);
    }
  });

  fastify.get("/albums", async (request, reply) => {
    const albums = await db.albums.findMany();
    return successResponseHandler(reply, {
      albums,
    });
  });

  fastify.get("/stream", streamController);
}

export default musicRoutes;
