import sqlite3 from 'sqlite3';
import readline from 'readline';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

console.log('\x1b[36m==================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m   Interactive SQLite Database Shell (Node.js)    \x1b[0m');
console.log('\x1b[36m==================================================\x1b[0m');
console.log('Type your SQL query and press Enter. Type \x1b[33mexit\x1b[0m to quit.');
console.log('Some useful commands:');
console.log('  - \x1b[32mSELECT * FROM users;\x1b[0m');
console.log('  - \x1b[32mSELECT * FROM colleges;\x1b[0m');
console.log('  - \x1b[32mSELECT * FROM courses;\x1b[0m');
console.log('\x1b[36m--------------------------------------------------\x1b[0m');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[35msqlite>\x1b[0m '
});

rl.prompt();

rl.on('line', (line) => {
  const query = line.trim();
  
  if (query.toLowerCase() === 'exit' || query.toLowerCase() === '.exit' || query.toLowerCase() === 'quit') {
    db.close();
    rl.close();
    process.exit(0);
  }

  if (!query) {
    rl.prompt();
    return;
  }

  // Support helper to show tables if user types .tables
  if (query.toLowerCase() === '.tables') {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
      if (err) {
        console.error('\x1b[31mError:\x1b[0m', err.message);
      } else {
        console.log(rows.map(r => r.name).join('   '));
      }
      rl.prompt();
    });
    return;
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('\x1b[31mError:\x1b[0m', err.message);
    } else if (rows.length === 0) {
      console.log('\x1b[33mQuery executed successfully. (0 rows returned or action completed)\x1b[0m');
    } else {
      console.table(rows);
    }
    rl.prompt();
  });
}).on('close', () => {
  db.close();
  process.exit(0);
});
