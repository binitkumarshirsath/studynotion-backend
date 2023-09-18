const mongoose = require("mongoose");
const sendVerificationMail = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  OTP: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

otpSchema.pre("save", async function () {
  try {
    const response = await sendVerificationMail(this.email, this.OTP);
    console.log("Email sent successfully to mail", this.email);
  } catch (error) {
    console.error("error while saving doc", error);
  }
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
