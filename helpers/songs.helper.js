import prisma from "../config/db.js";

export async function addPublicSong({
    createdBy,
    filePath,
    title
}) {
    return await prisma.songs.create({
        data: {
            created_by: createdBy,
            path: filePath,
            title: title
        }
    })
}

