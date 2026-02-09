require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const { run } = require("./configs/db"); // to have db connect
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

app.use(
  cors({
    origin: "http://localhost:4200", // Your Angular app URL
    credentials: true, // Allow cookies if needed later
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount route groups
app.use("/", authRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
