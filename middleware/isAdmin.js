const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
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

module.exports = isAdmin;
