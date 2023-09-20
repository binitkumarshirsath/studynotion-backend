const { JWT_SECRET } = require("../../config/env/env-vars");
const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Empty fields found, please try again.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User is not registered.",
      });
    }

    const passwordMatch = bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const payload = {
        id: user._id,
        email,
        role: user.accountType,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });
      user.token = token;
      user.password = undefined;
      return res
        .cookie("token", token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })
        .json({
          success: true,
          message: "User logged in successfully",
          token,
          user,
        });
    } else {
      return res.json({
        success: false,
        message:
          "Incorrect password entered , Please try again or try resetting the password",
      });
    }
  } catch (error) {
    console.error("Error while login", error);
    return res.json({
      success: false,
      message: "Error while login",
      error,
    });
  }
};

module.exports = loginController;
