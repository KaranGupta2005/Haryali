import userSchema from "../Schema.js";
import ExpressError from "./expressError.js";

export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};
