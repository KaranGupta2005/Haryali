import Joi from "joi";

export const emailSubscriptionSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

export const contactMessageSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
      "any.required": "Name is required",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
    }),
  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "string.min": "Message must be at least 10 characters long",
      "string.max": "Message must not exceed 1000 characters",
      "any.required": "Message is required",
    }),
});

export const newsletterSchema = Joi.object({
  subject: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      "string.min": "Subject must be at least 5 characters long",
      "string.max": "Subject must not exceed 200 characters",
      "any.required": "Subject is required",
    }),
  message: Joi.string()
    .min(20)
    .required()
    .messages({
      "string.min": "Message must be at least 20 characters long",
      "any.required": "Message is required",
    }),
});