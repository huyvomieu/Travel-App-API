const express = require('express')
const ItemController = require('../controllers/item.controller')
const Router = express.Router();


Router.get('/', ItemController.get)
Router.post('/', ItemController.post)
Router.put('/', ItemController.put)
Router.delete('/', ItemController.delete)

module.exports =  Router