const Joi = require("joi");

const CategoryModel = Joi.object({
  Key: Joi.string().allow('', null),
  Id: Joi.any().allow('', null),
  ImagePath: Joi.string(),
  Name: Joi.string().min(1).max(50).required(),
  Description: Joi.string().max(1000),
  deleted: Joi.boolean().default(false),
  status: Joi.number().default(1)
});

module.exports = CategoryModel;