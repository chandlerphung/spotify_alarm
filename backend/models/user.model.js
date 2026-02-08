const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    spotify_id: {
      type: String,
      required: true,
    },

    display_name: {
      type: String,
      required: true,
    },

    access_token: {
      type: String,
      required: true,
    },

    refresh_token: {
      type: String,
      required: true,
    },

    scope: String,

    token_expires_at: {
      type: Date,
      required: true,
    },

    playlists: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // still useful for auditing/logging
  },
);

module.exports = mongoose.model("User", userSchema);
