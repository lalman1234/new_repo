import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, dbQuery } from './database.js';
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
try {
  await initDb();
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Database initialization failed:', error);
}

// Global API Routes
// Fetch colleges list (publicly available for registration)
app.get('/api/colleges', async (req, res) => {
  try {
    const colleges = await dbQuery('SELECT id, name, code FROM colleges ORDER BY name ASC');
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Server error fetching colleges list' });
  }
});

// Mounted Routers
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/admin', adminRouter);

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
