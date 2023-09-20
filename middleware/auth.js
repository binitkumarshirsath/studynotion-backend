const { JWT_SECRET } = require("../config/env/env-vars");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
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

module.exports = auth;
