import prisma from "../config/db.js";

export async function getPublicPlaylists() {
  return await prisma.playlists.findMany();
}

export async function addPublicPlaylist({title}) {
  return await prisma.playlists.create({
    data : {
      title : title,
      isPublic : true,
    }
  })
}