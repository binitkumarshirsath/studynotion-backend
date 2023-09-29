const mongoose = require("mongoose");
const { DB_URL } = require("../env/env-vars");
module.exports.connectDb = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB connection successfull");
  } catch (error) {
    console.error("Error while connecting to DB" + error);
    process.exit(1);
  }
};
