import musicRoutes from "./music/index.js";

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.register(musicRoutes, {
    prefix : "/music",
  })
}

export default routes;
