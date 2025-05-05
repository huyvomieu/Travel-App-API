const Joi = require("joi");

const OrderModel = Joi.object({
  orderId: Joi.string().max(30),
  itemId: Joi.string().required(),
  paymentId: Joi.string().required(),
  userName: Joi.string().required(),
  total: Joi.string().required(),
  date: Joi.string()
});

module.exports = OrderModel;