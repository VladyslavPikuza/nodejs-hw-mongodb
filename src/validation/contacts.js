import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Usernmae should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+380\d{9}$/)
    .required()
    .messages({
      'string.base': 'Phone number should be a string',
      'string.pattern.base': 'Phone number must match the format +380XXXXXXXXX',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().min(3).max(20).email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Usernmae should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+380\d{9}$/)
    .messages({
      'string.base': 'Phone number should be a string',
      'string.pattern.base': 'Phone number must match the format +380XXXXXXXXX',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
