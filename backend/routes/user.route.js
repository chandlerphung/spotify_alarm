const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateHeader");
const User = require("../models/user.model");

router.get("/users/:spotify_id", authenticateToken, async (req, res) => {
  const spotify_id = req.params.spotify_id;

  // Security: verify the authenticated user matches the requested user
  if (req.user.spotify_id !== spotify_id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    // Fetch user data from DB
    const userData = await User.findOne({ spotify_id: spotify_id });

    // Check if user exists
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

module.exports = router;
