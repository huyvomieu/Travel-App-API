const express = require('express')
const OrderController = require('../controllers/order.controller')
const Router = express.Router();


Router.get('/', OrderController.get)
Router.get('/:id', OrderController.getById)
Router.post('/', OrderController.post)
Router.put('/', OrderController.put)
Router.delete('/', OrderController.delete)

module.exports =  Router