const axios = require("axios");

async function fetchAndSavePlaylists(user) {
  const spotifyResponse = await axios.get(
    "https://api.spotify.com/v1/me/playlists",
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
      params: {
        limit: 50,
      },
    },
  );

  const playlists = spotifyResponse.data.items.map((playlist) => ({
    name: playlist.name,
    uri: playlist.uri,
  }));

  user.playlists = playlists;
  await user.save();

  return playlists;
}

module.exports = {
  fetchAndSavePlaylists,
};
