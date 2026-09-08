/**
 * Server-side input validation and sanitization
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim()) && email.length <= 254;
}

export function sanitizeString(input: any, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function parsePositiveInt(val: any, defaultVal = 1): number {
  const num = parseInt(val, 10);
  return isNaN(num) || num <= 0 ? defaultVal : num;
}
