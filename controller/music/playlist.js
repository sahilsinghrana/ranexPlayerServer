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

export function getAllUserPlaylists(request, reply) {
  return {
    hello: "playlist list",
  };
}

export function addUserPlaylist() {
  return "Adding new Playlist";
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
