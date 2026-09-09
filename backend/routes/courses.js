import express from 'express';
import { dbQuery, dbRun, dbGet } from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses (available to all logged in users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await dbQuery('SELECT id, title, description, created_at FROM courses ORDER BY created_at DESC');
    res.json(courses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// Create course (super_admin or trainer only)
router.post('/', authenticateToken, requireRole(['super_admin', 'trainer']), async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Course title is required' });
  }

  try {
    const result = await dbRun(
      'INSERT INTO courses (title, description) VALUES (?, ?)',
      [title, description || '']
    );
    const newCourse = await dbGet('SELECT * FROM courses WHERE id = ?', [result.id]);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

// Delete course (super_admin or trainer only)
router.delete('/:id', authenticateToken, requireRole(['super_admin', 'trainer']), async (req, res) => {
  const { id } = req.params;

  try {
    const course = await dbGet('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await dbRun('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error deleting course' });
  }
});

export default router;
