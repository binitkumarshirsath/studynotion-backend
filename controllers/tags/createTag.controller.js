const Tag = require("../../models/tag.model");

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const isUniqueTag = await Tag.findOne({ name });
    if (isUniqueTag) {
      return res.json({
        success: false,
        message: "Tags need to be unique",
      });
    }

    const tag = await Tag.create({
      name,
      description,
    });

    return res.json({
      success: true,
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    console.error("Error while creating tag", error);
    return res.json({
      success: false,
      message: "Error while creating tag",
      error,
    });
  }
};

module.exports = createTag;
