const Tag = require("../../models/tag.model");

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    return res.json({
      success: true,
      message: "Tags retrived successfully",
      tags,
    });
  } catch (error) {
    console.error("Error while getting tag", error);
    return res.json({
      success: false,
      message: "Error while retrieving tag",
    });
  }
};

module.exports = getAllTags;
