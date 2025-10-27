import User from "../models/User";
import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("farmer", "buyer", "admin").default("farmer"),
  refreshTokens: Joi.array().items(
    Joi.object({
      token: Joi.string().required(),
      createdAt: Joi.date().default(Date.now),
    })
  ),
});
