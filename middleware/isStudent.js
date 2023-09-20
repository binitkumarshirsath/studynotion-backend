const jwt = require("jsonwebtoken");

const isStudent = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "student") {
      return res.json({
        success: false,
        message: "Not a student",
      });
    }
    next();
  } catch (error) {
    console.error("Error while authorizing student", error);
    return res.json({
      success: false,
      message: "Error while authorizing the student",
      error,
    });
  }
};

module.exports = isStudent;
