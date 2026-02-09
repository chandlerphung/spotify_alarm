const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { loginWithSpotify } = require("../services/auth.service");

// GET /auth/callback
router.get("/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${process.env.FRONTEND_URI}`);
  }

  try {
    const user = await loginWithSpotify(code);

    const jwt_token = {
      spotify_id: user.spotify_id,
      display_name: user.display_name,
    };
    const accessToken = jwt.sign(jwt_token, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Token expires in 1 hour

    res.redirect(`${process.env.FRONTEND_URI}/dashboard?token=${accessToken}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
