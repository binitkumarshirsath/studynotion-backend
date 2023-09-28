const Category = require("../models/Category");
const Course = require("../models/Course");

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

module.exports.getCategoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.body.categoryId;
    if (!categoryId) {
      return res.status(400).json({
        success: true,
        message: "Category id is required",
      });
    }

    const selectedCategoryCourses = await Category.findById(categoryId)
      .populate("course")
      .exec();

    if (!selectedCategoryCourses) {
      return res.statsu(404).json({
        success: false,
        message: "Courses not found",
      });
    }

    const differentCategoryCourses = await Category.findById({
      _id: {
        $ne: categoryId,
      },
    })
      .populate("course")
      .exec();

    //top 10 selling courses
    const topSellingCourse = await Course.find()
      .sort({ sold: -1 })
      .limit(10)
      .exec();
    return res.status(200).json({
      success: true,
      data: {
        selectedCategoryCourses,
        differentCategoryCourses,
        topSellingCourse,
      },
    });
  } catch (error) {
    console.error("Error while fetching category page details", error);
    return res.status.json({
      success: true,
      message: " Error while fetching category page details",
      error,
    });
  }
};
