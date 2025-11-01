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

export const emailSubscriptionSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters",
    }),
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

export const paraliSchema = Joi.object({
  farmerName: Joi.string().min(3).max(50).required(),
  location: Joi.string().min(3).max(100).required(),
  cropType: Joi.string()
    .valid("Standing Stubble", "Loose Straw")
    .required(),
  quantity: Joi.number().positive().precision(2).required(),
  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact number must be exactly 10 digits.",
    }),
  proposedPrice: Joi.number().min(0).precision(2).optional(),
  predictedPrice: Joi.number().min(0).precision(2).optional(),
  isListedForMarketplace: Joi.boolean().optional(),
});

export const buyerSchema = Joi.object({
  buyerName: Joi.string().min(3).max(50).required(),
  buyerEmail: Joi.string().email().required(),
  listingId: Joi.string().required(),
  cropType: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
});


