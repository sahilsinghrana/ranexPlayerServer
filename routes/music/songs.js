import { addSongController } from "../../controller/music/songs.controller.js";
import { successResponseHandler } from "../../handler/responseHandler.js";

async function songRoutes(fastify, options) {
    fastify.get("/", (request, reply) => {
  
        successResponseHandler(reply, {
            hello : "Songs"
        })
    } )

    fastify.post("/", addSongController)
    

}


export default songRoutes;