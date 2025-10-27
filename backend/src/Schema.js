import Joi from "joi";
import User from './models/User.js';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("farmer", "Farmer", "buyer", "Buyer", "logistics", "Logistics", "admin", "Admin").insensitive().default("farmer"),
  refreshTokens: Joi.array().items(
    Joi.object({
      token: Joi.string().required(),
      createdAt: Joi.date().default(Date.now),
    })
  ),
});
