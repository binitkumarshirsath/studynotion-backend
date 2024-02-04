const mongoose = require("mongoose");
require("dotenv").config();
const { DB_URL } = require("./env/env-vars");

exports.connect = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "StudyNotion",
    })
    .then(() => console.log("DB Connection Successfull!"))
    .catch((error) => {
      console.log("DB Connection failed!");
      console.error(error);
      process.exit(1);
    });
};
