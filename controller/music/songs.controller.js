import { successResponseHandler } from "../../handler/responseHandler.js";

export async function addSongController(request, reply) {
    const { title, path } = request.body;
    successResponseHandler(reply, {
        adding: {
            title, path
        }
    })
}