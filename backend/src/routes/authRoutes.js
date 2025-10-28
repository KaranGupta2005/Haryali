import express from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
} from '../controllers/authController.js';

import { userAuth, authorize } from '../middlewares/authMiddleware.js';
import { validateUserSignup, validateUserLogin } from '../middlewares/validate.js';
import { wrapAsync } from '../middlewares/wrapAsync.js';

const router = express.Router();

router.post('/signup', validateUserSignup, wrapAsync(signup));
router.post('/login', validateUserLogin, wrapAsync(login));
router.post('/refresh', wrapAsync(refreshToken)); 

router.post('/logout', userAuth, wrapAsync(logout)); 

router.get('/me', userAuth, wrapAsync((req, res) => {
  res.json({ 
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    }
  });
}));

router.get('/farmer', userAuth, authorize(['farmer']), wrapAsync((req, res) => {
  res.json({ 
    message: 'Welcome Farmer!',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    }
  });
}));

router.get('/buyer', userAuth, authorize(['buyer']), wrapAsync((req, res) => {
  res.json({ 
    message: 'Welcome Buyer!',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    }
  });
}));

router.get('/logistics', userAuth, authorize(['logistics']), wrapAsync((req, res) => {
  res.json({ 
    message: 'Welcome Logistics!',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    }
  });
}));

router.get('/admin', userAuth, authorize(['admin']), wrapAsync((req, res) => {
  res.json({ 
    message: 'Welcome Admin!',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    }
  });
}));

export default router;

