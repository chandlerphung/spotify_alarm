require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const { run } = require("./configs/db"); // to have db connect

const authRoutes = require("./routes/auth.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount route groups
app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
