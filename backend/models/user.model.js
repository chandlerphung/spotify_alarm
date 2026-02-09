const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    days: {
      type: [String], // e.g., ['M', 'T', 'Th']
      default: [],
    },
    playlist: {
      name: String,
      uri: String,
    },
  },
  { _id: false }, // optional: prevents Mongoose from creating an _id for each alarm
);

const userSchema = new mongoose.Schema(
  {
    spotify_id: { type: String, required: true },
    display_name: { type: String, required: true },
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    scope: String,
    token_expires_at: { type: Date, required: true },
    playlists: [
      {
        name: { type: String, required: true },
        uri: { type: String, required: true },
      },
    ],
    alarms: [alarmSchema], // <-- new field
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
