import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import cors from "@fastify/cors";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const __filename = fileURLToPath(import.meta.url);

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*", // Allow all origins (use specific domains in production)
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "Range"], // Specify allowed headers
  exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"], // Specify exposed headers
});

await fastify.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Ranex Player API",
      description: "Ranex Player API",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
  },
});

await fastify.register(fastifySwaggerUI, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: false,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});
fastify.register(routes);

await fastify.ready();
fastify.swagger();

fastify.listen(
  {
    port: 3000,
  },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log("running on : ", address);
  }
);
