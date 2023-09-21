const Course = require("../../models/course.model");

const getAllCourses = async (req, res) => {
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

    return res.json({
      success: true,
      message: "Fetched all courses",
      courses,
    });
  } catch (error) {
    console.error("Error while fetching courses", error);
    return res.json({
      success: false,
      message: "Error while fetching all courses",
      error,
    });
  }
};

module.exports = getAllCourses;
