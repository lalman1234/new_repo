import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register Student
router.post('/register', async (req, res) => {
  const { name, email, password, college_id } = req.body;

  if (!name || !email || !password || !college_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if college exists
    const college = await dbGet('SELECT * FROM colleges WHERE id = ?', [college_id]);
    if (!college) {
      return res.status(400).json({ message: 'Invalid college selection' });
    }

    // Check if user already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user as student
    await dbRun(
      'INSERT INTO users (name, email, password, role, college_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, 'student', college_id]
    );

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretkeyfortraininghub',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// Get profile details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'student') {
      user = await dbGet(
        `SELECT u.id, u.name, u.email, u.role, c.name as college_name 
         FROM users u 
         LEFT JOIN colleges c ON u.college_id = c.id 
         WHERE u.id = ?`,
        [req.user.id]
      );
    } else {
      user = await dbGet(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [req.user.id]
      );
    }

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

export default router;
