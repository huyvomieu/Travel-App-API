const express = require('express')
const OtpController = require('../controllers/otp.controller')
const Router = express.Router();


Router.post('/send-email', OtpController.sendEmail)

module.exports =  Router