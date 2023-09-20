const User = require("../../models/user.model");
const sendMail = require("../../utils/mailSender");

/*
    This controller is used to generated a token , save it in user db
    and send the link , generated via token to users mail,
    token is later used to verify, retrive data from db
    actual reset of password is done in resetPassword controller
*/
const passwordResetToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No user found with the email,try creating one.",
      });
    }

    const token = crypto.randomUUID();
    await User.findOneAndUpdate(
      { email },
      { token, tokenExpiry: new Date(Date.now() + 5 * 60 * 1000) },
      { new: true }
    );

    const url = `http://localhost:3000/reset-password/${token}`;
    await sendMail(email, "Reset password", "Reset password link", url);

    return res.json({
      success: true,
      message: "Successfully sent the email with reset link.",
    });
  } catch (error) {
    console.error("Error while generating passwordResetToken", error);
    return res.json({
      success: false,
      message: "Error while generating token for password reset",
      error,
    });
  }
};

module.exports = passwordResetToken;
