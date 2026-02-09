// backend/alarmScheduler.js
const cron = require("node-cron");
const axios = require("axios");
const User = require("./models/user.model");
const { refreshAccessToken } = require("./services/auth.service");

// Cron job: runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  console.log(
    `[Scheduler] Checking alarms for ${currentTime} day ${currentDay}`,
  );

  try {
    // Get all users that have alarms for this time
    const users = await User.find({ "alarms.time": currentTime });

    for (const user of users) {
      for (const alarm of user.alarms) {
        // Map your "days" to 0-6, assuming M=1,...S=0
        const dayMap = { S: 0, M: 1, T: 2, W: 3, TH: 4, F: 5, S: 6 };
        const alarmDays = (alarm.days ?? []).map((d) => dayMap[d]);
        if (!alarmDays.includes(currentDay)) continue;

        console.log(`[Scheduler] Triggering alarm for ${user.display_name}`);

        // Refresh token if expired
        const tokenExpiry = new Date(user.token_expires_at);
        let accessToken = user.access_token;
        if (Date.now() > tokenExpiry.getTime()) {
          console.log(`[Scheduler] Refreshing token for ${user.display_name}`);
          const refreshed = await refreshAccessToken(user.refresh_token);
          accessToken = refreshed.access_token;
          user.access_token = refreshed.access_token;
          user.refresh_token = refreshed.refresh_token ?? user.refresh_token;
          user.token_expires_at = new Date(
            Date.now() + refreshed.expires_in * 1000,
          );
          await user.save();
        }

        // Call Spotify API to play the playlist on the **currently active device**
        try {
          await axios.put(
            "https://api.spotify.com/v1/me/player/play",
            { context_uri: alarm.playlist.uri },
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          console.log(
            `[Scheduler] Played playlist ${alarm.playlist.name} for ${user.display_name}`,
          );
        } catch (err) {
          console.error(
            "Error playing playlist:",
            err.response?.data || err.message,
          );
        }
      }
    }
  } catch (err) {
    console.error("Error in alarm scheduler:", err);
  }
});
