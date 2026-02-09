const axios = require("axios");
const User = require("../models/user.model");
const config = require("../configs/config");
const utils = require("../utils");
const { getUserProfile } = require("./user.service");
const { fetchAndSavePlaylists } = require("./playlist.service");

async function refreshAccessToken(refreshToken) {
  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    {
      headers: {
        Authorization: utils.createBasicAuthHeader(
          config.client_id,
          process.env.CLIENT_SECRET,
        ),
        "Content-Type": config.content_type,
      },
    },
  );

  return tokenResponse.data;
}

async function loginWithSpotify(code) {
  // 1️⃣ Exchange code for tokens
  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    {
      grant_type: config.grant_type,
      code,
      redirect_uri: config.redirect_uri,
    },
    {
      headers: {
        Authorization: utils.createBasicAuthHeader(
          config.client_id,
          process.env.CLIENT_SECRET,
        ),
        "Content-Type": config.content_type,
      },
    },
  );

  const tokenData = tokenResponse.data;

  // 2️⃣ Get profile
  const profile = await getUserProfile(tokenData.access_token);

  // 3️⃣ Find existing user
  let user = await User.findOne({
    spotify_id: profile.id,
  });

  if (!user) {
    // Create new user
    user = new User({
      spotify_id: profile.id,
      display_name: profile.display_name,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      token_expires_at: utils.getTokenExpiration(tokenData.expires_in),
    });
  } else {
    // Refresh token
    const refreshedTokenData = await refreshAccessToken(user.refresh_token);

    user.access_token = refreshedTokenData.access_token;
    user.refresh_token = refreshedTokenData.refresh_token ?? user.refresh_token;
    user.token_expires_at = utils.getTokenExpiration(
      refreshedTokenData.expires_in,
    );
  }

  await user.save();

  // 4️⃣ Fetch + save playlists automatically
  try {
    await fetchAndSavePlaylists(user);
    console.log("Playlists saved on login");
  } catch (err) {
    console.error("Failed to fetch playlists on login:", err.message);
  }

  return user;
}

module.exports = {
  loginWithSpotify,
  refreshAccessToken,
};
