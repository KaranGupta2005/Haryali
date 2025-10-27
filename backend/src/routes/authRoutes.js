import express from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
} from '../controllers/authController.js';

import { userAuth, authorize } from '../middlewares/authMiddleware.js';
import { validateUser } from '../middlewares/validate.js';
import { wrapAsync } from '../middlewares/wrapAsync.js';

const router = express.Router();

router.post('/signup', validateUser, wrapAsync(signup));
router.post('/login', validateUser, wrapAsync(login));
router.post('/refresh', wrapAsync(refreshToken)); 

router.post('/logout', userAuth, wrapAsync(logout)); 

router.get('/me', userAuth, wrapAsync((req, res) => {
  res.json({ user: req.user });
}));

router.get('/farmer', userAuth, authorize(['farmer']), wrapAsync((req, res) => {
  res.json({ message: 'Welcome Farmer!' });
}));

router.get('/buyer', userAuth, authorize(['buyer']), wrapAsync((req, res) => {
  res.json({ message: 'Welcome Buyer!' });
}));

router.get('/logistics', userAuth, authorize(['logistics']), wrapAsync((req, res) => {
  res.json({ message: 'Welcome Logistics!' });
}));

export default router;

