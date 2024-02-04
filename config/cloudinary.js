const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = require("./env/env-vars");

exports.cloudnairyconnect = () => {
  try {
    if (!CLOUD_NAME || !CLOUD_NAME || !CLOUD_SECRET) {
      console.error("Provide cloud configs");
      throw new Error("Cloudinary conn failed");
    }
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUD_KEY,
      api_secret: CLOUD_SECRET,
    });
    console.log("Cloudinary connected");
  } catch (error) {
    console.log("error connecting CD" + error);
  }
};
