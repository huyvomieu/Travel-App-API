const sendEmail = require('../services/nodemail.service')

class OtpController {

  // [POST] api/otp/sendEmail
  async sendEmail(req, res) {
    try {
      const {to, subject, content } = req.body;
      await sendEmail(to,subject,content);
      res.status(201).json({ message: "Sended"  });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}

module.exports = new OtpController();
