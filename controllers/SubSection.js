const SubSection = require("../models/SubSection");
const { uploadToCloudinary } = require("../utils/uploadFile");
const Section = require("../models/Section");
module.exports.createSubSection = async (req, res) => {
  try {
    const { name, description, sectionId, timeDuration } = req.body;
    if (!name || !description || !sectionId || !timeDuration) {
      return res.status(400).json({
        success: false,
        message: "Empty fields found",
      });
    }

    const videoFile = req.files.videoFile;
    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: "Video file missing",
      });
    }

    const subSectionExists = await Section.findById({ _id: sectionId });
    if (!subSectionExists) {
      return res.status(400).json({
        success: false,
        message: "Section do not exists",
      });
    }
    const video = await uploadToCloudinary(videoFile);

    const newSubSection = await SubSection.create({
      name,
      description,
      timeDuration,
      videoUrl: video.secure_url,
    });
    // add entry in section
    const updatedSection = await Section.findByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          subSection: newSubSection._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      newSubSection,
      updatedSection,
    });
  } catch (error) {
    console.error("Error while creating subsection ", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating subsection",
      error,
    });
  }
};

module.exports.updateSubSection = async (req, res) => {
  try {
    const { name, description, timeDuration, subSectionId } = req.body;
    const videoFile = req?.files?.videoFile;
    let videoUrl;

    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(400).json({
        success: false,
        message: "Invalid subsection id",
      });
    }

    if (name) {
      subsection.name = name;
    }
    if (description) {
      subsection.description = description;
    }
    if (timeDuration) {
      subsection.timeDuration = timeDuration;
    }
    if (videoFile) {
      const video = await uploadToCloudinary(videoFile);
      videoUrl = video.secure_url;
      subsection.videoUrl = videoUrl;
    }

    await subsection.save();

    return res.status(200).json({
      success: true,
      messge: "SubSection updated successfully",
      subsection,
    });
  } catch (error) {
    console.error("Error while updating subsection ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating subsection",
      error,
    });
  }
};

module.exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields found",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ",
      });
    }

    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ",
      });
    }
    section.subSection.filter(
      (subSectionItem) =>
        subSectionItem.id.toString() !== subSectionId.toString()
    );
    await section.save();

    const deleteSubsection = await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Deleted subsection successfully",
      deleteSubsection,
    });
  } catch (error) {
    console.error("Error while deleting subsection", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting subsection",
      error,
    });
  }
};
