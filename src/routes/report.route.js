const express = require('express')
const ReportController = require('../controllers/report.controller')
const Router = express.Router();

// Tổng quan: doanh thu, tổng tour, khách, đơn
Router.get('/summary', ReportController.summary)
Router.get('/revenue-by-month', ReportController.revenueByMonth)
Router.get('/top-tours', ReportController.topTours)


module.exports =  Router