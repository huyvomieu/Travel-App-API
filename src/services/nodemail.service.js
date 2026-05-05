const nodeMailer = require("nodemailer");

require('dotenv').config();
const sendEmail = async (to, subject, content) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USE,
    to: to,
    subject: subject,
    html: content,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
