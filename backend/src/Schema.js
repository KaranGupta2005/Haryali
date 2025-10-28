import Joi from "joi";

export const userSignupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  fullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name must not exceed 100 characters',
      'any.required': 'Full name is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
  role: Joi.string()
    .valid("farmer", "buyer", "logistics", "admin")
    .insensitive()
    .default("farmer")
    .messages({
      'any.only': 'Role must be one of: farmer, buyer, logistics, admin',
    }),
});

export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});
