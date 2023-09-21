const cloudinary = require("cloudinary").v2;

//takes the file, -->img , height and quality
module.exports.uploadToCloudinary = async (file, height, quality) => {
  try {
    const folder = "binit_studynotion";
    const options = { folder };

    //set height or compress the quality
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";
    //actual uploaading of file
    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
    console.log("Resource Successfully upload to Cloudinary");
    //returns response so we can take the url of thumnbail out of it
    return response;
  } catch (error) {
    console.error("Error while uploading to Cloudindary", error);
  }
};
