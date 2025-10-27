import express from 'express';
import {
  signup,
  login,
  logout,
  refreshToken
} from '../controllers/authController.js';

import { userAuth, authorize } from '../middlewares/auth.middleware.js';
import ExpressError from '../middlewares/expressError.js';
import { wrapAsync } from '../middlewares/wrapAsync.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', userAuth, logout);

// Example protected route for testing
router.get('/me', userAuth, (req, res) => {
  res.json({ user: req.user });
});

// Example role-based route (optional)
router.get('/admin', userAuth, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
