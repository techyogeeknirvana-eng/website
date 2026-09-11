import { NextRequest } from 'next/server';
import jwt, { SignOptions } from 'jsonwebtoken';
import { db, ensureDbReady } from '../db/client';
import { User } from '@/types';
import { formatNameFromEmail } from '@/lib/auth/nameUtils';

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
  try {
    await ensureDbReady();
  } catch (_) {}

  // 1. Try Cookie
  const cookieToken = request.cookies.get('tygn_session_token')?.value;
  // 2. Try Authorization Header
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;
  let targetRow: any = null;
  let verifiedPayload: TokenPayload | null = null;

  try {
    if (token && token !== 'tygn_server_session_active') {
      const payload = verifyAuthToken(token);
      if (payload && payload.userId) {
        verifiedPayload = payload;
        targetRow = await db.queryOne(
          'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
          [payload.userId]
        );

        // If this serverless container does not have the user row yet, auto-provision it immediately
        if (!targetRow && payload.email) {
          try {
            const { userService } = await import('../services/userService');
            const name = formatNameFromEmail(payload.email);
            await userService.ensureUserInDb({
              id: payload.userId,
              email: payload.email,
              name,
              role: payload.role || 'USER',
              username: payload.email.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'user',
            });
            targetRow = await db.queryOne(
              'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
              [payload.userId]
            );
          } catch (provisionErr) {
            console.warn('Auto-provisioning in container deferred:', provisionErr);
          }
        }
      }
    }
  } catch (err) {
    console.warn('extractAuthUser token query error:', err);
  }

  // 3. Fallback: Check active session headers
  if (!targetRow) {
    const userIdHeader = request.headers.get('x-user-id');
    const userEmailHeader = request.headers.get('x-user-email');

    try {
      if (userIdHeader) {
        targetRow = await db.queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [userIdHeader]);
      }
      if (!targetRow && userEmailHeader) {
        targetRow = await db.queryOne(
          'SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL',
          [userEmailHeader.toLowerCase().trim()]
        );
      }
      // If user session header is provided but user record does not exist yet in this DB, auto-provision it
      if (!targetRow && (userIdHeader || userEmailHeader)) {
        const { userService } = await import('../services/userService');
        const email = (userEmailHeader || `${userIdHeader || 'user'}@tygn.dev`).toLowerCase().trim();
        const displayName = formatNameFromEmail(email);
        await userService.ensureUserInDb({
          id: userIdHeader || `user_${Date.now()}`,
          email,
          name: displayName,
          role: 'USER',
          username: email.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'user',
        });
        targetRow = await db.queryOne('SELECT * FROM users WHERE id = ? OR LOWER(email) = ?', [
          userIdHeader || '',
          email
        ]);
      }
    } catch (_) {}
  }

  // 4. Fallback: If JWT is cryptographically verified, guarantee auth persistence across any stateless container
  if (!targetRow && verifiedPayload && verifiedPayload.userId && verifiedPayload.email) {
    const cleanEmail = verifiedPayload.email.toLowerCase().trim();
    const displayName = formatNameFromEmail(cleanEmail);
    return {
      id: verifiedPayload.userId,
      name: displayName,
      username: cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'user',
      email: cleanEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0284c7&color=fff&bold=true`,
      role: verifiedPayload.role || 'USER',
      title: 'Developer & Member',
      collegeOrCompany: 'Techyogeek Nirvana Community',
      education: 'B.Tech / Computer Science',
      skills: ['TypeScript', 'React'],
      interests: ['Development'],
      github: '',
      linkedin: '',
      portfolio: '',
      experienceLevel: 'Beginner',
      xp: 100,
      level: 'Novice',
      badges: [],
      bio: '',
      createdAt: new Date().toISOString(),
      isSuspended: false,
      isEmailVerified: true,
      referralCode: `TYGN-${verifiedPayload.userId.slice(-6).toUpperCase()}`,
      referralCount: 0,
    };
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
