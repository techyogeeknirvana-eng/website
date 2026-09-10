import { NextRequest } from 'next/server';
import jwt, { SignOptions } from 'jsonwebtoken';
import { db } from '../db/client';
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

function safeParseJson(val: any, fallback: any = []): any {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return fallback;
  }
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

export async function extractAuthUser(request: NextRequest, allowSuspended: boolean = false): Promise<User | null> {
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
      targetRow = await db.queryOne(
        'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
        [payload.userId]
      );
    }
  }

  // 3. Fallback: Check active session headers
  if (!targetRow) {
    const userIdHeader = request.headers.get('x-user-id');
    const userEmailHeader = request.headers.get('x-user-email');

    if (userIdHeader) {
      targetRow = await db.queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [userIdHeader]);
    }
    if (!targetRow && userEmailHeader) {
      targetRow = await db.queryOne(
        'SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL',
        [userEmailHeader.toLowerCase().trim()]
      );
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
    skills: safeParseJson(targetRow.skills, []),
    interests: safeParseJson(targetRow.interests, []),
    github: targetRow.github || '',
    linkedin: targetRow.linkedin || '',
    portfolio: targetRow.portfolio || '',
    experienceLevel: targetRow.experience_level || 'Beginner',
    xp: targetRow.xp || 0,
    level: targetRow.level || 'Novice',
    badges: safeParseJson(targetRow.badges, []),
    bio: targetRow.bio || '',
    createdAt: targetRow.created_at,
    isSuspended: Boolean(targetRow.is_suspended),
    isEmailVerified: Boolean(targetRow.is_email_verified),
    referralCode: targetRow.referral_code,
    referredBy: targetRow.referred_by,
    referralCount: targetRow.referral_count,
  };
}
