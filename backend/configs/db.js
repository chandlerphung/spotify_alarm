const mongoose = require("mongoose");

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${db_username}:${db_password}@alarmifydb.xm1ob7n.mongodb.net/?appName=AlarmifyDB`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
  dbName: "user_db",
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);
