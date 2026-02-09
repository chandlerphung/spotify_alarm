const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const authenticateToken = require("../middleware/authenticateHeader");

// Add an alarm
router.patch("/alarms/:spotify_id", authenticateToken, async (req, res) => {
  console.log("PATCH /alarms/:spotify_id hit");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Params:", req.params);

  const { spotify_id } = req.params;
  const { alarm } = req.body;

  if (!alarm) return res.status(400).json({ error: "Alarm data missing" });

  try {
    const user = await User.findOneAndUpdate(
      { spotify_id },
      { $push: { alarms: alarm } },
      { new: true },
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.alarms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save alarm" });
  }
});

router.delete("/alarms/:spotify_id", authenticateToken, async (req, res) => {
  const { spotify_id } = req.params;
  const { time, playlistUri } = req.body; // info to identify the alarm

  if (!time) return res.status(400).json({ error: "Alarm time missing" });

  try {
    const user = await User.findOneAndUpdate(
      { spotify_id },
      {
        $pull: {
          alarms: {
            time,
            ...(playlistUri ? { "playlist.uri": playlistUri } : {}),
          },
        },
      },
      { new: true },
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Alarm deleted", alarms: user.alarms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete alarm" });
  }
});

module.exports = router;
