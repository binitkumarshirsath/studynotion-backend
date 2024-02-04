const nodemailer = require("nodemailer");
require("dotenv").config();
const { mailPass, mailUser } = require("../config/env/env-vars");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: `${mailUser}`,
        pass: `${mailPass}`,
      },
    });

    let info = await transporter.sendMail({
      from: `"Study Notion" <${mailUser}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

module.exports = mailSender;
