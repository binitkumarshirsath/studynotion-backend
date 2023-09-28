const sendMail = require("../utils/mailSender");
const { contactUs, contactUsAdmin } = require("../mail-template/contactUs");
module.exports.contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Empty fields found.",
      });
    }

    const name = firstName + " " + lastName;
    const emailTemplate = contactUs(name, email);
    const emailAdminTempate = contactUsAdmin(name, email, message);
    const sendMailToAdmin = await sendMail(
      "princevinitkumar007@gmail.com",
      `Contact us mail from ${email}`,
      `${email} sent you a mail`,
      emailAdminTempate
    );
    const response = await sendMail(
      email,
      "Thanks for contacting us",
      "We will get back to you as soon as possible",
      emailTemplate
    );

    return res.status(200).json({
      success: true,
      message: "Contact us mail sent to admin and user successfully.",
    });
  } catch (error) {
    console.error("Error occurred while contacting us", error);
    return res.status(500).json({
      success: false,
      message: "Error while contacting us",
      error,
    });
  }
};
