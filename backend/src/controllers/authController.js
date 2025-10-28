import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from '../utils/generateToken.js';
import ExpressError from '../middlewares/expressError.js';

// Signup
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      throw new ExpressError(400, 'Full name, email, and password are required');
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      throw new ExpressError(400, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      fullName: fullName.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword, 
      role: role ? role.toLowerCase() : 'farmer'
    });
    
    await newUser.save();

    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ExpressError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      throw new ExpressError(400, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ExpressError(400, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new ExpressError(401, 'Unauthorized: No refresh token');
    }

    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
      await user.save();
    }

    res.clearCookie('accessToken', { 
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.clearCookie('refreshToken', { 
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    
    if (!token) {
      throw new ExpressError(401, 'Refresh token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ExpressError(404, 'User not found');
    }

    const found = user.refreshTokens.find(rt => rt.token === token);
    if (!found) {
      throw new ExpressError(401, 'Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    
    setAuthCookies(res, newAccessToken, token);

    res.json({ message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
};