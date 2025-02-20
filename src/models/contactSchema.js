const Joi = require('joi');

const contactValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'work','personal').required(),
});

const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'work','personal'),
});

module.exports = { contactValidationSchema, updateContactValidationSchema };
