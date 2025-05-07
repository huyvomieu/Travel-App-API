const express = require('express')
const OrderController = require('../controllers/auth.controller')
const Router = express.Router();


Router.get('/', OrderController.get)
Router.get('/:id', OrderController.getById)
Router.post('/login', OrderController.login)
Router.post('/register', OrderController.register)

module.exports =  Router