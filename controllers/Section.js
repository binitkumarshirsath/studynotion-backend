const Section = require("../models/Section");
const Course = require("../models/Course");
module.exports.createSection = async (req, res) => {
  try {
    const sectionName = req.body.sectionName;
    const courseId = req.body.courseId;
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Empty section name found",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Empty course id found",
      });
    }

    const existingCourse = await Course.findById({ _id: courseId });
    if (!existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with given course id doesnt exists",
      });
    }
    const section = await Section.create({ sectionName });
    const updatedCourse = await Course.findByIdAndUpdate(
      {
        _id: courseId,
      },
      {
        $push: {
          courseContent: section.id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      sucess: true,
      message: "Section created successfully",
      section,
    });
  } catch (error) {
    console.error("Error while creating section", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error,
    });
  }
};
