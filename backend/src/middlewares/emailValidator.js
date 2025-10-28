import {
  emailSubscriptionSchema,
  contactMessageSchema,
  newsletterSchema,
} from "../Schema.js";
import ExpressError from "./expressError.js";

export const validateEmailSubscription = (req, res, next) => {
  const { error } = emailSubscriptionSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

export const validateContactMessage = (req, res, next) => {
  const { error } = contactMessageSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

export const validateNewsletter = (req, res, next) => {
  const { error} = newsletterSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};