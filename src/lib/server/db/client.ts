import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  // Detect Vercel / AWS Lambda serverless read-only environment
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL_ENV;
  let dbPath: string;

  if (isServerless) {
    // In Vercel serverless functions, the root /var/task is strictly read-only.
    // The only writable directory is /tmp.
    const tmpDir = '/tmp';
    const tmpDbPath = path.join(tmpDir, 'tygn_production.db');
    const sourceDbPath = path.join(process.cwd(), 'data', 'tygn_production.db');

    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        try {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } catch (err) {
          console.warn('Could not copy bundled DB to /tmp, creating fresh in /tmp:', err);
        }
      }
    }

    dbPath = tmpDbPath;
  } else {
    // Standard local development or dedicated server
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = process.env.DATABASE_FILE || path.join(dataDir, 'tygn_production.db');
  }

  dbInstance = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? undefined : undefined,
  });

  try {
    if (isServerless) {
      // In serverless /tmp, DELETE journal mode avoids shared-memory (.shm) locking issues across container cold starts
      dbInstance.pragma('journal_mode = DELETE');
    } else {
      // Enable WAL mode (Write-Ahead Logging) for local concurrent operations
      dbInstance.pragma('journal_mode = WAL');
    }
    dbInstance.pragma('foreign_keys = ON');
    dbInstance.pragma('synchronous = NORMAL');
  } catch (pragmaErr) {
    console.warn('Pragma setup warning:', pragmaErr);
  }

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
