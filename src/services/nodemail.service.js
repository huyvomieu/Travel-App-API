const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, content) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "helpdesktravelapp@gmail.com",
      pass: "ymsc mqss cftq ooyn",
    },
  });

  const mailOptions = {
    from: "helpdesktravelapp@gmail.com",
    to: to,
    subject: subject,
    html: content,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
