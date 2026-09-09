import express from 'express';
import bcrypt from 'bcryptjs';
import { dbQuery, dbRun, dbGet } from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply super_admin middleware to all endpoints in this router
router.use(authenticateToken, requireRole(['super_admin']));

// Get all trainers
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await dbQuery('SELECT id, name, email FROM users WHERE role = "trainer" ORDER BY id DESC');
    res.json(trainers);
  } catch (error) {
    console.error('Fetch trainers error:', error);
    res.status(500).json({ message: 'Server error fetching trainers' });
  }
});

// Create trainer
router.post('/trainers', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required' });
  }

  try {
    // Check if email already registered
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'trainer']
    );

    res.status(201).json({
      id: result.id,
      name,
      email,
      role: 'trainer',
    });
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ message: 'Server error provisioning trainer' });
  }
});

// Get all students (including college names)
router.get('/students', async (req, res) => {
  try {
    const students = await dbQuery(
      `SELECT u.id, u.name, u.email, c.name as college_name, u.created_at 
       FROM users u
       LEFT JOIN colleges c ON u.college_id = c.id
       WHERE u.role = "student"
       ORDER BY u.created_at DESC`
    );
    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
});

export default router;
