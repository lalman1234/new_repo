import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || './database.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Promisify helper database methods
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  // Create tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS colleges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      college_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(college_id) REFERENCES colleges(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed colleges if empty
  const collegesCount = await dbGet('SELECT COUNT(*) as count FROM colleges');
  if (collegesCount.count === 0) {
    console.log('Seeding mock colleges...');
    await dbRun("INSERT INTO colleges (name, code) VALUES ('Harvard University', 'HU')");
    await dbRun("INSERT INTO colleges (name, code) VALUES ('Stanford University', 'SU')");
    await dbRun("INSERT INTO colleges (name, code) VALUES ('MIT', 'MIT')");
    await dbRun("INSERT INTO colleges (name, code) VALUES ('Oxford University', 'OU')");
  }

  // Seed super_admin if empty
  const adminsCount = await dbGet("SELECT COUNT(*) as count FROM users WHERE role = 'super_admin'");
  if (adminsCount.count === 0) {
    console.log('Seeding default Super Admin...');
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    await dbRun(
      "INSERT INTO users (name, email, password, role, college_id) VALUES (?, ?, ?, ?, ?)",
      ['Super Admin', 'admin@training.com', adminPasswordHash, 'super_admin', null]
    );
  }
};

export default db;
