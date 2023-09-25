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

const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: "Binit Kumar @studynotion",
      to: `${to}`,
      subject: `${subject}`,
      text: `${text}`,
      html: `${html}`,
    });

    console.log(`mail sent successfully to: ${user} , info:`, info);
  } catch (error) {
    console.error("Error while sending OTP", error);
  }
};

module.exports = sendMail;
