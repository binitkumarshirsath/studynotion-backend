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

module.exports.updateSection = async (req, res) => {
  try {
    const sectionName = req.body.sectionName;
    const courseId = req.body.courseId;
    const sectionId = req.body.sectionId;
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section name is required.",
      });
    }

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section id is required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        sectionName,
      },
      {
        new: true,
      }
    );

    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
      course,
    });
  } catch (error) {
    console.error("Error while updating section ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating subsection",
      error,
    });
  }
};

module.exports.deleteSection = async (req, res) => {
  try {
    const sectionId = req.body.sectionId;
    const courseId = req.body.courseId;
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid section or course Id",
      });
    }

    const doesSectionExists = await Section.findById({ _id: sectionId });
    const doesCourseExists = await Course.findById({ _id: courseId });

    if (!doesSectionExists || !doesCourseExists) {
      return res.status.json({
        success: false,
        message: "Section or Course do not exist with the given id",
        sectionId: `Section Id ${sectionId} , course id ${courseId}`,
      });
    }
    //remove from course model
    doesCourseExists.courseContent = doesCourseExists.courseContent.filter(
      (contentId) => {
        return contentId.toString() !== sectionId.toString();
      }
    );
    await doesCourseExists.save();
    await Section.findByIdAndDelete({ _id: sectionId });

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      course: doesCourseExists,
    });
  } catch (error) {
    console.error("Error while deleting section ", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error,
    });
  }
};
