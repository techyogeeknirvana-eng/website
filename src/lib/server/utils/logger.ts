/**
 * Production-ready server logger that redacts sensitive credentials
 */

function sanitize(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitize);

  const clean: Record<string, any> = {};
  const sensitiveKeys = ['password', 'password_hash', 'token', 'secret', 'jwt', 'authorization', 'cookie'];

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context ? JSON.stringify(sanitize(context)) : '');
  },
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context ? JSON.stringify(sanitize(context)) : '');
  },
  error: (message: string, err?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, err instanceof Error ? err.stack : (err ? JSON.stringify(sanitize(err)) : ''));
  },
};
