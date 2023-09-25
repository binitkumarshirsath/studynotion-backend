const mongoose = require("mongoose");

module.exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection successfull");
  } catch (error) {
    console.error("Error while connecting to DB" + error);
    process.exit(1);
  }
};
