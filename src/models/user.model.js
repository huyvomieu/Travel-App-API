const Joi = require("joi");

const UserModel = Joi.object({
  id: Joi.string().max(30),
  username: Joi.string().alphanum().min(3).max(20).required(), // Username làm key
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(100).required(),
  cartId: Joi.string().max(100)
});

module.exports = UserModel;