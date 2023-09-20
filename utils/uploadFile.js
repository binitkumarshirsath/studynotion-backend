const cloudinary = require("cloudinary").v2;

const {
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
} = require("../config/env/env-vars");

module.exports.connectToCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUD_KEY,
      api_secret: CLOUD_SECRET,
    });
    console.log("Connection successfull to cloudinary.");
  } catch (error) {
    console.error("error while connecting to Cloudinary", error);
    process.exit(1);
  }
};

//
const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
const imageSize = 1024;

//need to refactor this to make it reusable
module.exports.uploadToCloudinary = async (req, res) => {
  try {
    const file = req.files.image;
    if (!fileTypes.includes(file.mimetype))
      return console.error("Image formats supported: JPG, PNG, JPEG");

    if (file.size / 1024 > imageSize)
      return console.error(`Image size should be less than ${imageSize}kb`);
    const cloudFile = await cloudinary.uploader.upload(file.tempFilePath);
    return;
  } catch (error) {
    console.error("Error while uploading file to cloudinary", error);
  }
};
