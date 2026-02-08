const { default: axios } = require("axios");

async function getUserProfile(access_token) {
  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
}

module.exports = {
  getUserProfile,
};
