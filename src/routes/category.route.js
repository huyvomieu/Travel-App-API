const express = require('express')
const CategoryController = require('../controllers/category.controller')
const Router = express.Router();


Router.get('/', CategoryController.get)
Router.post('/', CategoryController.post)
Router.put('/', CategoryController.put)
Router.delete('/', CategoryController.delete)

module.exports =  Router