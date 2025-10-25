import Database from 'better-sqlite3';

let db;

export function getDatabase() {
  if (!db) {
    db = new Database('mydatabase.sqlite');
    
    // Create table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start TEXT NOT NULL,
        end TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}
