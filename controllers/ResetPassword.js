const User = require("../models/User");
const sendMail = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  passwordResetToken,
  passwordUpdated,
} = require("../mail-template/passwordUpdate");
//generate token and save it in users schema
module.exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Empty email field found",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(300).json({
        success: false,
        message: "No user registered with this email",
      });
    }
    //add this token in user db and add one more field known as expires in
    // for token expiry
    const token = crypto.randomUUID();
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        tokenExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
      {
        new: true,
      }
    );

    const url = `http://localhost:3000/reset-password/${token}`;
    const tokenMailTemplate = passwordResetToken(email, url);
    await sendMail(email, "Regarding Password reset.", "", tokenMailTemplate);

    return res.status(200).json({
      success: true,
      message: "Successfully sent the reset password mail.",
    });
  } catch (error) {
    console.error("Error while password reset token generation", error);
    return res.status(500).json({
      success: false,
      message: "Error while password reset token generation",
      error,
    });
  }
};

//use token generated to reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Empty fields found",
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }
    if (user.tokenExpiresIn < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      return res.status(400).json({
        success: false,
        message: "Error while hashing the password",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: user._id,
      },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    updatedUser.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Password reset successfully, try loggin with new password.",
    });
  } catch (error) {
    console.error("Error while resetting password", error);
    return res.status(500).json({
      success: false,
      message: "Error while resetting password",
      error,
    });
  }
};
