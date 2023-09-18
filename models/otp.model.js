const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  OTP: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
