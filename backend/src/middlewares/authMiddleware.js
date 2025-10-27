import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ExpressError from './expressError.js';

export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ExpressError(401, 'Authentication token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new ExpressError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ExpressError(401, 'Access token expired'));
    }
    next(new ExpressError(err.statusCode || 500, err.message || 'Internal Server Error'));
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ExpressError(403, 'You are not authorized to access this resource')
      );
    }
    next();
  };
};
  