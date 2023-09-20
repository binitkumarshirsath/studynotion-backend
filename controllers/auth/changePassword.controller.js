const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const sendMail = require("../../utils/mailSender");
const changePassword = async (req, res) => {
  try {
    const { password, newPassword, confirmNewPassword } = req.body;
    if (!password || !newPassword || !confirmNewPassword) {
      return res.json({
        success: false,
        message: "Empty fields found",
      });
    }
    if (confirmNewPassword != newPassword) {
      return res.json({
        success: false,
        message: "New Password and confirm password do not match",
      });
    }

    const user = await User.findOne({ email: req.user.email });

    const response = await bcrypt.compare(password, user.password);
    if (response) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      const newUser = await User.findOneAndUpdate(
        { email: req.user.email },
        {
          password: newHashedPassword,
        },
        {
          new: true,
        }
      );
      newUser.password = undefined;
      await sendMail(
        req.user.email,
        "Password updated successfully!",
        "Password updated successfully",
        "<h2>Password changed</h2>"
      );
      return res.json({
        success: true,
        message: "Password updated successfully",
        newUser,
      });
    } else {
      return res.json({
        success: false,
        message: "Entered current password is wrong",
      });
    }
  } catch (error) {
    console.error("Error while changing password", error);
    return res.json({
      success: false,
      message: "Error while changing password",
      error,
    });
  }
};

module.exports = changePassword;
