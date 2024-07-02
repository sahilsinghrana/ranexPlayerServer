import db from "../../config/db.js";
import streamController from "../../controller/music/stream.js";
import {
  errorResponseHandler,
  successResponseHandler,
} from "../../handler/responseHandler.js";
import playlistRoutes from "./playlist.js";

async function musicRoutes(fastify, options) {
  fastify.register(playlistRoutes, { prefix: "/playlist" });

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