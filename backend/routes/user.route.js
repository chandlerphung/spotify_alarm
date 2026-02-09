const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateHeader");
const User = require("../models/user.model");

router.get("/users/:spotify_id", authenticateToken, async (req, res) => {
  const spotify_id = req.params.spotify_id;

  if (req.user.spotify_id !== spotify_id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const userData = await User.findOne(
      { spotify_id },
      { playlists: 1, alarms: 1 }, // include alarms
    );

    if (!userData) return res.status(404).json({ error: "User not found" });

    // Send both playlists and alarms
    res.json(userData); // ✅ returns playlists AND alarms
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

module.exports = router;
