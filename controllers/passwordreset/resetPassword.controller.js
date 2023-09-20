const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword) {
      return res.json({
        success: false,
        message: "Empty fields found of pwd or cnfPwd while resetting pwd.",
      });
    }

    if (!token) {
      return res.json({
        success: false,
        message: "Token not found , try again",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const userToken = await User.findOne({ token });
    if (!userToken) {
      return res.json({
        success: false,
        message: "user token not found, try generating one again",
      });
    }

    if (userToken.tokenExpiry < Date.now()) {
      return res.json({
        message: false,
        message: "Token is expired. Try generating one again",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const userToUpdate = await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );
    userToUpdate.password = undefined;
    return res.json({
      success: true,
      message: "Reset password successfull",
      userToUpdate,
    });
  } catch (error) {
    console.error("Error while resetting password", error);
    return res.json({
      success: false,
      message: "Error while resetting password",
      error,
    });
  }
};

module.exports = resetPassword;
