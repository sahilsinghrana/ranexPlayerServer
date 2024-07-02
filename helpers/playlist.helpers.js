import prisma from "../config/db.js";
import publicPlaylists from "../samples/playlists.js";

export async function getPublicPlaylists() {
  return await prisma.playlists.findMany();
}
