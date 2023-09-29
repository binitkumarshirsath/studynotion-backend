const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail-template/emailVerification");

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
    index: { expireAfterSeconds: 300 },
  },
});
/*
 just setting the `expires` option on the `createdAt` field schema is not enough to make the documents automatically expire after 5 minutes. 

We also need to create an index on the `createdAt` field for MongoDB to actually perform the auto-expiration.

The key points:

- `expires` in schema just marks the field as expirable
- We need to create an index on `createdAt` 
- Set `expireAfterSeconds` option to define expiration time

With this index, MongoDB will automatically delete documents where `createdAt` is more than 300 seconds (5 minutes) old.
*/

otpSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 300,
  }
);

otpSchema.pre("save", async function (next) {
  try {
    const mailTemplate = otpTemplate(this.OTP);
    await mailSender(this.email, "Email Verification", "OTP", mailTemplate);
    console.log("Email sent successfully with otp to ", this.email);
  } catch (error) {
    console.error("Error while saving otp", error);
  }
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
