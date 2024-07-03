import prisma from "../../config/db.js";
import supabase from "../../config/supabase.js";
import {
  errorResponseHandler,
  successResponseHandler,
} from "../../handler/responseHandler.js";
import { addPublicPlaylist, getPublicPlaylists } from "../../helpers/playlist.helpers.js";

export async function getPublicPlaylistsConstroller(request, reply) {
  try {
    const allPublicPlaylists = await getPublicPlaylists();
    successResponseHandler(reply, allPublicPlaylists);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
}

export async function addPublicPlaylistController(request, reply) {
  const { title } = request.body;
  try {

    const addedPlaylist = await addPublicPlaylist({
      title
    });
    successResponseHandler(reply, addedPlaylist)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export async function getAllUserPlaylists(request, reply) {
  try {
    // testing 
    const user = request.user;
    successResponseHandler(reply, user)
  } catch (err) {
    errorResponseHandler(reply, 500, err)
  }
}

export async function addUserPlaylist(request, reply) {
  const { title } = request.body;
  const user = request.user;
  const userId = user.id
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


  return "Adding new user Playlist";
}

export function removePlaylist() {
  return "Deleting playlist";
}

export function getSongsFromPlaylist() {
  return "Retrieving songs from playlist";
}

export function updateUserPlaylist() {
  return "Updating playlist";
}

export function addSongToUserPlaylist() {
  return "adding song playlist";
}

export function removeSongFromUsrePlaylist() {
  return "removing song playlist";
}

export function reorderSongInUserPlaylist() {
  return "reordering song playlist";
}
