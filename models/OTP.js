const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  OTP: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60 * 1000,
  },
});

otpSchema.pre("save", async function (next) {
  try {
    await mailSender(this.email, this.OTP);
    console.log("Email sent successfully with otp to ", this.email);
  } catch (error) {
    console.error("Error while saving otp", error);
  }
});

const OTP = mongoose.model("OTO", otpSchema);

module.exports = OTP;
