const Category = require("../models/Category");

module.exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Empty fields found",
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category needs to be unique",
      });
    }
    const category = await Category.create({
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.error("Error while creating category", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating category",
      error,
    });
  }
};

module.exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: false,
      message: "All categories fetched",
      categories,
    });
  } catch (error) {
    console.error("Error while fetching all categories", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching all categories",
      error,
    });
  }
};
