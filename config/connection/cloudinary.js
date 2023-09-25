const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = require("../env/env-vars");

module.exports.connectToCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUD_KEY,
      api_secret: CLOUD_SECRET,
    });
    console.log("Connection successfull to cloudinary.");
  } catch (error) {
    console.error("Error while connecting to cloudinary", error);
    process.exit(1);
  }
};
