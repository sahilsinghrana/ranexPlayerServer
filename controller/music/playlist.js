import prisma from "../../config/db.js";

import {
  errorResponseHandler,
  successResponseHandler,
} from "../../handler/responseHandler.js";

import { getUserIdFromUserObj } from "../../helpers/auth.helpers.js";
import { addPublicPlaylist, getPublicPlaylists } from "../../helpers/playlist.helpers.js";
import { checkAdminMiddleware } from "../../hooks/auth.hook.js";

export async function getPublicPlaylistsConstroller(request, reply) {
  try {
    const allPublicPlaylists = await getPublicPlaylists();
    successResponseHandler(reply, allPublicPlaylists);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
}

export async function addPublicPlaylistController(request, reply) {
  checkAdminMiddleware(request, reply)
  const userId = getUserIdFromUserObj(request.user)
  
  const { title } = request.body;
  try {
    const addedPlaylist = await addPublicPlaylist({
      title,
      userId
    });
    successResponseHandler(reply, addedPlaylist)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export async function getAllUserPlaylists(request, reply) {
  try {
    const userId = getUserIdFromUserObj(request.user)

    const userPlaylists = await prisma.user_playlists.findMany({
      where: {
        created_by: userId
      }
    })
    successResponseHandler(reply, userPlaylists)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export async function addUserPlaylist(request, reply) {
  const { title } = request.body;
  const userId = getUserIdFromUserObj(request.user)
  try {
    const createdPlaylist = await prisma.user_playlists.create({
      data: {
        title,
        user_id: userId,
        created_by: userId
      }
    })
    successResponseHandler(reply, createdPlaylist)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export async function removePlaylist(request, reply) {
  try {
    const { playlistId } = request.body;
    if (!playlistId) throw new Error("playlistId is required")
    const userId = getUserIdFromUserObj(request.user)
    const updatedPlaylist = await prisma.user_playlists.delete({
      where: {
        created_by: userId,
        id: playlistId
      }
    })
    successResponseHandler(reply, updatedPlaylist)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export function getSongsFromPlaylist() {
  return "Retrieving songs from playlist";
}

export async function updateUserPlaylist(request, reply) {
  try {
    const { title, playlistId } = request.body;
    if (!playlistId) throw new Error("playlistId is required")
    const userId = getUserIdFromUserObj(request.user)

    const updatedPlaylist = await prisma.user_playlists.update({
      where: {
        created_by: userId,
        id: playlistId
      },
      data: {
        title: title
      }
    })
    successResponseHandler(reply, updatedPlaylist)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export function addSongToUserPlaylist() {
  return "adding song playlist";
}

export function removeSongFromUserPlaylist() {
  return "removing song playlist";
}

export function reorderSongInUserPlaylist() {
  return "reordering song playlist";
}
