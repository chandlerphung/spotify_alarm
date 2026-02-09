require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const { run } = require("./configs/db"); // to have db connect
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const alarmRoutes = require("./routes/alarm.route");

app.use(
  cors({
    origin: `${process.env.FRONTEND_URI}`, // Your Angular app URL
    credentials: true, // Allow cookies if needed later
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount route groups
app.use("/", authRoutes);
app.use("/api", userRoutes);
app.use("/api", alarmRoutes);

// Start scheduler
require("./alarmScheduler"); // <-- this will start node-cron

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
