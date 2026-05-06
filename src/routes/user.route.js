const express = require('express')
const UserController = require('../controllers/user.controller')
const Router = express.Router();


Router.get('/', UserController.get)
Router.post('/', UserController.post)
Router.put('/', UserController.put)
Router.delete('/', UserController.delete)
Router.get('/:id', UserController.get)
Router.put('/:id', UserController.put)
Router.delete('/:id', UserController.delete)

module.exports =  Router
