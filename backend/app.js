require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const config = require("./config/config");
const utils = require("./utils");
const { run } = require("./config/db")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const error = req.query.error;

  if (error !== undefined) {
    res.redirect("http://localhost:4200");
  }

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: {
        grant_type: config.grant_type,
        code: code,
        redirect_uri: config.redirect_uri,
      },
      headers: {
        Authorization: utils.createBasicAuthHeader(
          config.client_id,
          process.env.CLIENT_SECRET,
        ),
        "Content-Type": config.content_type,
      },
    });

    console.log(response.data);
    res.redirect("http://localhost:4200");
  } catch (error) {
    console.error(`Error ${error.response.status}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
