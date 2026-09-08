import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = process.env.DATABASE_FILE || path.join(dataDir, 'tygn_production.db');
  
  dbInstance = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? undefined : undefined,
  });

  // Enable WAL mode (Write-Ahead Logging) for high concurrency and fast read/write operations
  dbInstance.pragma('journal_mode = WAL');
  // Enable foreign key constraints enforcement
  dbInstance.pragma('foreign_keys = ON');
  // Synchronous NORMAL is safe in WAL mode and drastically improves transaction throughput
  dbInstance.pragma('synchronous = NORMAL');

  // Execute schema creation and initial seeding
  try {
    const { runMigrations } = require('./migrations');
    runMigrations();
  } catch (err) {
    console.error('Migration error:', err);
  }

  return dbInstance;
}

export const db = {
  get: () => getDatabase(),
};
