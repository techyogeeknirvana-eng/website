import { NextRequest } from 'next/server';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getDatabase } from '../db/client';
import { User } from '@/types';

export const JWT_SECRET = process.env.JWT_SECRET || 'tygn_prod_secret_auth_token_key_2026_secure';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export function signAuthToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, expiresIn: SignOptions['expiresIn'] = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function extractAuthUser(request: NextRequest, allowSuspended: boolean = false): User | null {
  const db = getDatabase();

  // 1. Try Cookie
  const cookieToken = request.cookies.get('tygn_session_token')?.value;
  // 2. Try Authorization Header
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;
  let targetRow: any = null;

  if (token && token !== 'tygn_server_session_active') {
    const payload = verifyAuthToken(token);
    if (payload && payload.userId) {
      if (payload.sessionId) {
        const sessionExists = db.prepare('SELECT id FROM user_sessions WHERE id = ?').get(payload.sessionId);
        if (!sessionExists) {
          return null; // Session revoked in DB (e.g. on user suspension or logout)
        }
      }
      targetRow = db.prepare(`
        SELECT * FROM users WHERE id = ? AND deleted_at IS NULL
      `).get(payload.userId) as any;
    }
  }

  // 3. Fallback: Check active session headers
  if (!targetRow) {
    const userIdHeader = request.headers.get('x-user-id');
    const userEmailHeader = request.headers.get('x-user-email');

    if (userIdHeader) {
      targetRow = db.prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL').get(userIdHeader) as any;
    }
    if (!targetRow && userEmailHeader) {
      targetRow = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL').get(userEmailHeader.toLowerCase().trim()) as any;
    }
  }

  if (!targetRow) return null;
  if (targetRow.is_suspended === 1 && !allowSuspended) return null;

  return {
    id: targetRow.id,
    name: targetRow.name,
    username: targetRow.username,
    email: targetRow.email,
    avatar: targetRow.avatar,
    role: targetRow.role,
    title: targetRow.title || '',
    collegeOrCompany: targetRow.college_or_company || '',
    education: targetRow.education || '',
    skills: JSON.parse(targetRow.skills || '[]'),
    interests: JSON.parse(targetRow.interests || '[]'),
    github: targetRow.github || '',
    linkedin: targetRow.linkedin || '',
    portfolio: targetRow.portfolio || '',
    experienceLevel: targetRow.experience_level || 'Beginner',
    xp: targetRow.xp || 0,
    level: targetRow.level || 'Novice',
    badges: JSON.parse(targetRow.badges || '[]'),
    bio: targetRow.bio || '',
    createdAt: targetRow.created_at,
    isSuspended: Boolean(targetRow.is_suspended),
    isEmailVerified: Boolean(targetRow.is_email_verified),
    referralCode: targetRow.referral_code,
    referredBy: targetRow.referred_by,
    referralCount: targetRow.referral_count,
  };
}
