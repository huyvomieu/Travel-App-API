const Joi = require("joi");

const CategoryModel = Joi.object({
  Id: Joi.string().max(30),
  ImagePath: Joi.string(),
  Name: Joi.string().min(3).max(100).required(),
});

module.exports = CategoryModel;