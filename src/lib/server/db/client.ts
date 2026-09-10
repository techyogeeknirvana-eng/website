import postgres from 'postgres';
import path from 'path';
import fs from 'fs';

let pgClient: postgres.Sql | null = null;
let sqliteClient: any = null;

// Determine connection string from environment
function getPostgresConnectionString(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  );
}

// Convert SQLite '?' parameter placeholders to PostgreSQL '$1', '$2', ...
function convertSqlPlaceholders(sql: string): string {
  let idx = 1;
  return sql.replace(/\?/g, () => `$${idx++}`);
}

export function getPostgresClient(): postgres.Sql | null {
  if (pgClient) return pgClient;

  const connectionString = getPostgresConnectionString();
  if (!connectionString) {
    return null;
  }

  try {
    // prepare: false is required for Supabase transaction poolers (PgBouncer on port 6543)
    pgClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: connectionString.includes('localhost') ? false : 'require',
    });
    return pgClient;
  } catch (err) {
    console.error('Failed to initialize PostgreSQL connection:', err);
    return null;
  }
}

// Optional SQLite fallback for local offline development when no DATABASE_URL is configured
function getSqliteClient(): any {
  if (sqliteClient) return sqliteClient;

  try {
    const Database = require('better-sqlite3');
    const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    let dbPath: string;

    if (isServerless) {
      const tmpDbPath = path.join('/tmp', 'tygn_production.db');
      const sourceDbPath = path.join(process.cwd(), 'data', 'tygn_production.db');
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
        try { fs.copyFileSync(sourceDbPath, tmpDbPath); } catch (_) {}
      }
      dbPath = tmpDbPath;
    } else {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      dbPath = process.env.DATABASE_FILE || path.join(dataDir, 'tygn_production.db');
    }

    sqliteClient = new Database(dbPath);
    try {
      sqliteClient.pragma(isServerless ? 'journal_mode = DELETE' : 'journal_mode = WAL');
      sqliteClient.pragma('foreign_keys = ON');
    } catch (_) {}

    return sqliteClient;
  } catch (err) {
    console.warn('SQLite fallback unavailable in this environment:', err);
    return null;
  }
}

let migrationPromise: Promise<void> | null = null;
export async function ensureDbReady(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      try {
        const { runMigrations } = await import('./migrations');
        await runMigrations();
      } catch (e) {
        console.warn('Auto-migration deferred:', e);
      }
    })();
  }
  return migrationPromise;
}

/**
 * Unified Async Database Interface for Supabase/PostgreSQL with automatic parameter translation
 */
export const db = {
  isPostgres(): boolean {
    return Boolean(getPostgresConnectionString());
  },

  async queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const pg = getPostgresClient();
    if (pg) {
      const convertedSql = convertSqlPlaceholders(sql);
      const rows = await pg.unsafe(convertedSql, params);
      return rows as unknown as T[];
    }

    const sqlite = getSqliteClient();
    if (sqlite) {
      return sqlite.prepare(sql).all(...params) as T[];
    }

    throw new Error('Database connection failed: DATABASE_URL environment variable is missing.');
  },

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const pg = getPostgresClient();
    if (pg) {
      const convertedSql = convertSqlPlaceholders(sql);
      const rows = await pg.unsafe(convertedSql, params);
      return (rows[0] as unknown as T) || null;
    }

    const sqlite = getSqliteClient();
    if (sqlite) {
      const row = sqlite.prepare(sql).get(...params);
      return (row as T) || null;
    }

    throw new Error('Database connection failed: DATABASE_URL environment variable is missing.');
  },

  async execute(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
    const pg = getPostgresClient();
    if (pg) {
      const convertedSql = convertSqlPlaceholders(sql);
      const result = await pg.unsafe(convertedSql, params);
      return { rowCount: result.count || 0 };
    }

    const sqlite = getSqliteClient();
    if (sqlite) {
      const res = sqlite.prepare(sql).run(...params);
      return { rowCount: res.changes || 0 };
    }

    throw new Error('Database connection failed: DATABASE_URL environment variable is missing.');
  },

  async execRaw(sql: string): Promise<void> {
    const pg = getPostgresClient();
    if (pg) {
      await pg.unsafe(sql);
      return;
    }

    const sqlite = getSqliteClient();
    if (sqlite) {
      sqlite.exec(sql);
      return;
    }

    throw new Error('Database connection failed: DATABASE_URL environment variable is missing.');
  },
};

// Legacy alias for compatibility
export function getDatabase(): any {
  return db;
}
