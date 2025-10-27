import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from '../utils/generateToken.js';
import ExpressError from '../middlewares/expressError.js';

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      throw new ExpressError(400, 'User with this email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashed,
      role,
    });

    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });

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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password'); // ⚠️ select password since you marked it as select: false
    if (!user) {
      throw new ExpressError(400, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ExpressError(400, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });

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

export const logout = async (req,res,next)=>{
    const user=req.user;
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        return next(new ExpressError(401,'Unauthorized'));
    }

    if(refreshToken && user){
        user.refreshTokens=user.refreshTokens.filter(rt=>rt.token!==refreshToken);
        await user.save();
    }

    res.clearCookie('accessToken',{ path: '/' });
    res.clearCookie('refreshToken',{ path: '/' });

    res.status(200).json({ message: 'Logged out successfully' });
}

export const refreshToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ExpressError(401, 'Refresh token missing');
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) throw new ExpressError(404, 'User not found');

  const found = user.refreshTokens.find(rt => rt.token === token);
  if (!found) throw new ExpressError(401, 'Invalid refresh token');

  const accessToken = generateAccessToken(user._id, user.role);
  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Strict', maxAge: 15*60*1000 });
  res.json({ message: 'Token refreshed' });
};