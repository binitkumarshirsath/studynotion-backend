const nodemailer = require("nodemailer");
const { mailPass, mailUser } = require("../config/env/env-vars.js");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${mailUser}`,
    pass: `${mailPass}`,
  },
});

/*
user is user email and otp is otpnumber
we need to pass it as string to avoid errors
*/
const sendVerificationMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: "Binit Kumar @studynotion",
      to: `${user}`,
      subject: "OTP VERIFICATION AT STUDYNOTION",
      text: `${otp}`,
      html: `${otp}`,
    });

    console.log(`mail sent successfully to: ${user} , info:`, info);
  } catch (error) {
    console.error("Error while sending OTP", error);
  }
};

module.exports = sendVerificationMail;
