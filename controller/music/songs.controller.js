import util from "node:util"
import { pipeline } from "node:stream"
import fs from "node:fs"

const pump = util.promisify(pipeline)


import { successResponseHandler } from "../../handler/responseHandler.js";
import { addPublicSong } from "../../helpers/songs.helper.js";

export async function addSongController(request, reply) {
    // const { title, path } = request.body;
    // const files = await request.file();
    const parts = request.parts()
    for await (const part of parts) {
        if (part.type === 'file') {
            await pump(part.file, fs.createWriteStream(`./uploads/${part.filename}`))
        } else {
           console.log("------------------")
        }
    }

    const addedSong = await addPublicSong({ request: request.body, })

    successResponseHandler(reply, addedSong)
}