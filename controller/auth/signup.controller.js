const User = require("../../models/user.model");
const OTP = require("../../models/otp.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
      accountType,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.json({
        success: false,
        message: "Empty fields found! Please try again.",
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password & ConfirmPassword do not match",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User is already registered ! Plase login",
      });
    }

    const existingOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!existingOtp) {
      return res.json({
        success: false,
        message: "OTP not found. Please try again.",
      });
    }
    if (otp !== existingOtp.OTP) {
      return res.json({
        success: false,
        message: "OTP is invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    };

    const response = await User.create(user);

    return res.json({
      success: true,
      message: "User registered successfully",
      response,
    });
  } catch (error) {
    console.error("Error while signup", error);
    return res.json({
      success: false,
      message: "Error occured while signup",
      error,
    });
  }
};
