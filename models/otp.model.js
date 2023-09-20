const mongoose = require("mongoose");
const sendMail = require("../utils/mailSender");

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
    expires: 5 * 60 * 1000,
  },
});

/*
This is a pre hook , it runs before saving anything in otp table,
before saving the otp in db , we are sending the otp to the users mail
so we can later compare it
*/
otpSchema.pre("save", async function (next) {
  try {
    const response = await sendMail(
      this.email,
      "OTP FOR SIGNUP",
      this.OTP,
      this.OTP
    );
    next();
    console.log("Email sent successfully to mail", this.email, response);
  } catch (error) {
    console.error("error while saving doc", error);
  }
});

const OTP = mongoose.model("Otp", otpSchema);
module.exports = OTP;
