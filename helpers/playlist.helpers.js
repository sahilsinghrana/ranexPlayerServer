import prisma from "../config/db.js";
import publicPlaylists from "../samples/playlists.js";

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