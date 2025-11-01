import { userSignupSchema, userLoginSchema,paraliSchema } from "../Schema.js";
import ExpressError from "./expressError.js";

export const validateUserSignup = (req, res, next) => {
  const { error } = userSignupSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

export const validateUserLogin = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

export const validateParali=(req, res, next) => {
  const { error } = paraliSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: errorMessages });
  }else{
    next();
  }
}


