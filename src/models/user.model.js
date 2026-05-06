const Joi = require("joi");

const getFormatDate = require("../helper/getFormatDateNow");

const baseFields = {
  id: Joi.string().max(30),
  key: Joi.string().max(30),
  username: Joi.string().alphanum().min(3).max(20),
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().allow(""),
  password: Joi.string().min(4).max(100),
  avatar: Joi.string().allow(""),
  guide: Joi.boolean(),
  cartId: Joi.string().max(100).allow(""),
  created: Joi.alternatives().try(Joi.date(), Joi.string()),
};

const UserCreateModel = Joi.object({
  ...baseFields,
  username: baseFields.username.required(),
  name: baseFields.name.required(),
  email: baseFields.email.required(),
  password: baseFields.password.required(),
  phone: baseFields.phone.default(""),
  avatar: baseFields.avatar.default(""),
  guide: baseFields.guide.default(false),
  created: baseFields.created.default(getFormatDate),
}).options({ stripUnknown: true });

const UserUpdateModel = Joi.object({
  ...baseFields,
  username: baseFields.username.optional(),
  password: baseFields.password.optional(),
  created: baseFields.created.optional(),
})
  .min(1)
  .options({ stripUnknown: true });

module.exports = {
  UserCreateModel,
  UserUpdateModel,
};
