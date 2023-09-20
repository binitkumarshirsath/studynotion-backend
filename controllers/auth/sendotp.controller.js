const User = require("../../models/user.model");
const OTP = require("../../models/otp.model");
const otpGenerator = require("otp-generator");
/*
This controller is used only for sending otp while singup is 
happening, we can make it reusable for sending otp , we might 
need to remove the existingUser check if we want to use this same
function for sending otp when tapped forgetpassword
or when user wants to change their password
*/
const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.find({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User is already registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    /*
    Regenerating otp until we get a unique one 
    trash way to do it , better way would be use a package that 
    provides unique otp
    */
    var existingOTP = await OTP.find({ OTP: otp });
    while (existingOTP) {
      //Resassinging the otp value , until we get a unique one
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOTP = await OTP.find({ OTP: otp });
    }

    const body = {
      OTP: otp,
      email,
    };

    //This will trigger the pre hook of otp, that will
    // send the otp to user
    await OTP.create(body);
    return res.json({
      success: true,
      message: "OTP generated successfully",
      otp,
    });
  } catch (error) {
    console.error("Error while sending OTP:", error);
    return res.json({
      success: false,
      message: "Error while sending otp",
      error,
    });
  }
};

module.exports = sendOTPController;
