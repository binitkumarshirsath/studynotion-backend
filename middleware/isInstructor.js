const jwt = require("jsonwebtoken");

const isInstructor = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "instructor") {
      return res.json({
        success: false,
        message: "Not an instructor",
      });
    }
    next();
  } catch (error) {
    console.error("Error while authorizing instructor", error);
    return res.json({
      success: false,
      message: "Error while authorizing the instructor",
      error,
    });
  }
};

module.exports = isInstructor;
