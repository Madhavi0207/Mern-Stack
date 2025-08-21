// require("dotenv").config();
const mongoose = require("mongoose");

require("dotenv").config();

const ConnectionString = process.env.MONGO_URL;

async function connectToDatabase() {
  await mongoose.connect(ConnectionString);
  console.log("Connected to MongoDB");
}

module.exports = connectToDatabase;
