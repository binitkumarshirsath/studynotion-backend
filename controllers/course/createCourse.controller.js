const Course = require("../../models/course.model");
const Tag = require("../../models/tag.model");
const User = require("../../models/user.model");
const { uploadToCloudinary } = require("../../utils/uploadFile");

const createCouse = async (req, res) => {
  try {
    const { name, description, price, tag, whatYouWillLearn } = req.body;

    const thumbnailImage = req.files.thumbnailImage;

    if (
      !name ||
      !description ||
      !price ||
      !tag ||
      !whatYouWillLearn ||
      !thumbnailImage
    ) {
      return res.json({
        succcess: false,
        message: "All fields are required.",
      });
    }

    const instructor = await User.findOne({ _id: req.user._id });
    if (!instructor) {
      return res.json({
        success: false,
        message: "Invalid instructor",
      });
    }

    const existingTag = await Tag.findOne({ _id: tag });
    if (!existingTag) {
      return res.json({
        success: false,
        message: "Invalid tag",
      });
    }

    //upload thumbnail to cloudinary and get its secure url

    const response = await uploadToCloudinary(thumbnailImage);

    const newCourse = await Course.create({
      name,
      description,
      price,
      tag,
      whatYouWillLearn,
      instructor: instructor._id,
      thumbnail: response.secure_url,
    });

    //add new course entry to tag and user schema
    const updatedTagResponse = await Tag.findByIdAndUpdate(
      { _id: existingTag._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    const updatedInstructorResponse = await User.findByIdAndUpdate(
      { _id: instructor._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: `Course created successfully,
        Added entry in tag and user models too`,
      newCourse,
      updatedInstructorResponse,
      updatedTagResponse,
    });
  } catch (error) {
    console.error("Error while creating course", error);
    return res.json({
      success: false,
      message: "Error while creating course",
      error,
    });
  }
};

module.exports = createCouse;
