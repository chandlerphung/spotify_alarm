require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const config = require("./configs/config");
const utils = require("./utils");
const { run } = require("./configs/db");
const User = require("./models/user.model");
const { loginWithSpotify } = require("./services/auth.service");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/callback", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
