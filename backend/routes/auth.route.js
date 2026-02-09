const express = require("express");
const router = express.Router();

const { loginWithSpotify } = require("../services/auth.service");

// GET /auth/callback
router.get("/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect("http://localhost:4200");
  }

  try {
    const user = await loginWithSpotify(code);

    // later → create session/JWT here

    res.redirect("http://localhost:4200");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
