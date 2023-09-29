const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

module.exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Invalid email. Failed to send otp",
      });
    }

    const existingUser = await User.find({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    let Otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let similarOtp = await OTP.find({ OTP: Otp });
    while (similarOtp) {
      Otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      similarOtp = await OTP.find({ OTP: Otp });
    }

    const otpPayload = {
      email: email,
      OTP: Otp,
    };

    const response = await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      response,
    });
  } catch (error) {
    console.error("Error while sending OTP", error);
    return res.status(500).json({
      success: false,
      message: "Error while sending OTP",
      error,
    });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !accountType
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm password do not match",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please try to login",
      });
    }

    const existingOTP = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!existingOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP doesnt exist",
      });
    }
    if (existingOTP.OTP !== otp) {
      return res.status(402).json({
        success: false,
        message: "OTP do not match . Please try again.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      accountType,
      image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    });

    const response = await user.save();
    response.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Account created successfully",
      response,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while signing up",
      err,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        messsage: "Empty fieds found while logging in",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json({
        success: false,
        message: "User not registered. Please Signup first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password entered",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.accountType,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });
    user.token = token;
    user.password = undefined;

    return res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        token,
      });
  } catch (err) {
    console.error("Error while login ", err);
    return res.status(500).json({
      success: false,
      message: "Error while login",
      err,
    });
  }
};
