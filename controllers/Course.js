const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/uploadFile");

module.exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      instructor,
      whatYouWillLearn,
      price,
      category,
      tags,
      thumbnail,
    } = req.body;

    if (
      !courseName ||
      !courseDescription ||
      !instructor ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !tags ||
      !thumbnail
    ) {
      return res.status(402).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    //verify the instructor
    const existingInstructor = await User.findById({ _id: req.user.id });

    if (!existingInstructor) {
      return res.status(402).json({
        success: false,
        message: "Invalid instructor",
      });
    }
    //verify the category
    const existingCategory = await Category.findById({ _id: category });

    if (!existingCategory) {
      return res.status(402).json({
        success: false,
        message: "Invalid category",
      });
    }
    // upload the thumbnail to cloudinary to get a secure url
    const thumbnailUrl = await uploadToCloudinary(thumbnail);

    // create new course
    const course = new Course({
      courseName,
      courseDescription,
      thumbnail: thumbnailUrl,
      instructor,
      whatYouWillLearn,
      price,
      category,
      tags,
    });

    const newCourse = await course.save();

    //push the course to instructors course array;

    const instructorResponse = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );
    instructorResponse.password = undefined;
    //push it in category array
    const categoryResponse = await Category.findByIdAndUpdate(
      {
        _id: category,
      },
      {
        $push: {
          course: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "New course added",
      course: newCourse,
      category: categoryResponse,
      instructor: instructorResponse,
    });
  } catch (error) {
    console.error("Error while creating course", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating course",
      error,
    });
  }
};

module.exports.getAllcourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        name: true,
        description: true,
        price: true,
        instructor: true,
        whatYouWillLearn: true,
        thumbnail: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    ).populate("instructor");
    return res.status(200).json({
      success: true,
      message: "All courses feteched",
      courses,
    });
  } catch (error) {
    console.error("Error while fetching all courses", error);
    return res.status(500).json({
      success: true,
      message: "Error while fetching courses",
      error,
    });
  }
};
