const Joi = require("joi");

const getFormatDate = require('../helper/getFormatDateNow')

const UserModel = Joi.object({
  id: Joi.string().max(30),
  username: Joi.string().alphanum().min(3).max(20).required(), // Username làm key
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(4).max(100).required(),
  avatar: Joi.string().allow(''),
  guide: Joi.bool().default(false),
  cartId: Joi.string().max(100),
  created: Joi.date().default(getFormatDate)
});

module.exports = UserModel;