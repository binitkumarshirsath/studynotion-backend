const { JWT_SECRET } = require("../config/env/env-vars");
const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error("Error while authenticating", error);
    return res.json({
      success: false,
      message: "Error while authenticating the client.",
      error,
    });
  }
};

module.exports.isAdmin = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res.json({
        success: false,
        message: "Not an Admin",
      });
    }
    next();
  } catch (error) {
    console.error("Error while authorizing admin", error);
    return res.json({
      success: false,
      message: "Error while authorizing the admin",
      error,
    });
  }
};

module.exports.isInstructor = (req, res, next) => {
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

module.exports.isStudent = (req, res, next) => {
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
