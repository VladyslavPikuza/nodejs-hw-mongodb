const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least {#limit} characters",
    "string.max": "Name should have at most {#limit} characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "Password should have at least {#limit} characters",
    "string.max": "Password should have at most {#limit} characters",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "Password should have at least {#limit} characters",
    "string.max": "Password should have at most {#limit} characters",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

module.exports = { registerSchema, loginSchema };
