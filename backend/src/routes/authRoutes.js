import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { env } from '../config/env.js';

const router = express.Router();
const googleClient = new OAuth2Client(env.googleClientId);

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.googleClientId,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.avatar = picture;
      } else {
        user = new User({ googleId, email, name, avatar: picture });
      }
    }
    
    user.lastLogin = new Date();
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(401).json({ ok: false, message: 'Authentication failed' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return res.status(401).json({ ok: false, message: 'User not found' });
    }

    res.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(401).json({ ok: false, message: 'Invalid token' });
  }
});

export default router;
