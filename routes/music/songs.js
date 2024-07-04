import { addSongController, getPublicSongsController } from "../../controller/music/songs.controller.js";

async function songRoutes(fastify) {
    fastify.get("/", getPublicSongsController)
    fastify.post("/", addSongController)
}

export default songRoutes;