import { db } from '../db/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signAuthToken } from '../middleware/authGuard';
import { User, UserRole } from '@/types';
import { creditService } from './creditService';
import { userService } from './userService';

export const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

export function isGlobalAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}

import { formatNameFromEmail } from '@/lib/auth/nameUtils';
export { formatNameFromEmail };

export const authService = {
  async loginWithPassword(
    email: string,
    passwordPlain: string,
    ip?: string,
    userAgent?: string
  ): Promise<{ user: User; token: string }> {
    const cleanEmail = email.toLowerCase().trim();

    const row = await db.queryOne(`
      SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL
    `, [cleanEmail]);

    if (!row) {
      throw new Error('Invalid email or password.');
    }

    if (!row.password_hash) {
      throw new Error('This account was registered via Google Sign-In. Please sign in with Google.');
    }

    const isMatch = await bcrypt.compare(passwordPlain, row.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const user = await userService.getUserById(row.id);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.isSuspended || row.is_suspended === 1) {
      throw new Error(`Account Banned: This account (${cleanEmail}) has been suspended by a platform administrator. You cannot log in.`);
    }

    // Generate Session
    const sessionId = 'sess_' + crypto.randomUUID();
    const token = signAuthToken({
      userId: row.id,
      email: row.email,
      role: row.role as UserRole,
      sessionId,
    });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await db.execute(`
      INSERT INTO user_sessions (id, user_id, token_hash, ip_address, user_agent, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [sessionId, row.id, tokenHash, ip || null, userAgent || null, expiresAt, new Date().toISOString()]);

    // Ensure wallet is initialized and reset if needed
    await creditService.getOrCreateWallet(user.id);

    return { user, token };
  },

  async signUpWithPassword(
    data: {
      email: string;
      passwordPlain: string;
      name?: string;
      username?: string;
      referredByCode?: string;
    },
    ip?: string,
    userAgent?: string
  ): Promise<{ user: User; token: string }> {
    const cleanEmail = data.email.toLowerCase().trim();

    // Check duplicate email
    const existingEmail = await db.queryOne('SELECT id, is_suspended FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingEmail) {
      if (existingEmail.is_suspended === 1) {
        throw new Error(`Account Banned: The account (${cleanEmail}) has been suspended by an administrator. You cannot register or log in.`);
      }
      throw new Error('An account with this email already exists.');
    }

    const displayName = formatNameFromEmail(cleanEmail, data.name);
    let candidateUsername = (data.username || cleanEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    if (!candidateUsername) candidateUsername = 'user';

    // Ensure unique username
    let finalUsername = candidateUsername;
    let counter = 1;
    while (await db.queryOne('SELECT id FROM users WHERE username = ?', [finalUsername])) {
      finalUsername = `${candidateUsername}_${counter++}`;
    }

    const passwordHash = await bcrypt.hash(data.passwordPlain, 12);
    const userId = 'user_' + crypto.randomUUID().slice(0, 12);
    const role: UserRole = isGlobalAdminEmail(cleanEmail) ? 'ADMIN' : 'USER';
    const referralCode = userService.generateReferralCode(finalUsername);
    const now = new Date().toISOString();

    await db.execute(`
      INSERT INTO users (
        id, name, username, email, password_hash, avatar, role, title, college_or_company,
        education, skills, interests, github, linkedin, experience_level, xp, level,
        badges, bio, is_suspended, is_email_verified, email_verified_at, referral_code,
        referral_count, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `, [
      userId,
      displayName,
      finalUsername,
      cleanEmail,
      passwordHash,
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0284c7&color=fff&bold=true`,
      role,
      role === 'ADMIN' ? 'Platform Administrator' : 'Developer & Member',
      'Techyogeek Nirvana Community',
      'B.Tech / Computer Science',
      JSON.stringify(['TypeScript', 'React', 'Problem Solving']),
      JSON.stringify(['Development', 'Tech Careers']),
      '',
      '',
      'Beginner',
      100,
      'Novice',
      JSON.stringify(['🔥 Community Contributor']),
      'Student builder and Techyogeek Nirvana member.',
      0,
      1, // Verified for password signups
      now,
      referralCode,
      0,
      now,
      now
    ]);

    // Initialize 10 daily credits in wallet
    await creditService.getOrCreateWallet(userId);

    // Process referral bonus if code given
    if (data.referredByCode) {
      await creditService.processReferral(userId, cleanEmail, data.referredByCode);
    }

    // Generate session token
    const sessionId = 'sess_' + crypto.randomUUID();
    const token = signAuthToken({
      userId,
      email: cleanEmail,
      role,
      sessionId,
    });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await db.execute(`
      INSERT INTO user_sessions (id, user_id, token_hash, ip_address, user_agent, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [sessionId, userId, tokenHash, ip || null, userAgent || null, expiresAt, now]);

    const user = await userService.getUserById(userId);
    return { user: user!, token };
  },

  async loginOrSyncGoogle(
    email: string,
    name?: string,
    avatar?: string,
    referredByCode?: string,
    ip?: string,
    userAgent?: string
  ): Promise<{ user: User; token: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    let user = await userService.getUserByEmail(cleanEmail);

    if (user && user.isSuspended) {
      throw new Error(`Account Banned: The account (${cleanEmail}) has been suspended by an administrator. You cannot log in.`);
    }

    if (!user) {
      // Create user
      const userId = 'user_' + crypto.randomUUID().slice(0, 12);
      const role: UserRole = isGlobalAdminEmail(cleanEmail) ? 'ADMIN' : 'USER';
      const displayName = formatNameFromEmail(cleanEmail, name);
      
      let candidateUsername = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (!candidateUsername) candidateUsername = 'user';
      let finalUsername = candidateUsername;
      let counter = 1;
      while (await db.queryOne('SELECT id FROM users WHERE username = ?', [finalUsername])) {
        finalUsername = `${candidateUsername}_${counter++}`;
      }

      const referralCode = userService.generateReferralCode(finalUsername);
      const userAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0284c7&color=fff&bold=true`;

      await db.execute(`
        INSERT INTO users (
          id, name, username, email, password_hash, avatar, role, title, college_or_company,
          education, skills, interests, github, linkedin, experience_level, xp, level,
          badges, bio, is_suspended, is_email_verified, email_verified_at, referral_code,
          referral_count, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?
        )
      `, [
        userId,
        displayName,
        finalUsername,
        cleanEmail,
        null,
        userAvatar,
        role,
        role === 'ADMIN' ? 'Platform Administrator' : 'Developer & Member',
        'Techyogeek Nirvana Community',
        'B.Tech / Computer Science',
        JSON.stringify(['TypeScript', 'React', 'Problem Solving']),
        JSON.stringify(['Development', 'AI']),
        '',
        '',
        'Beginner',
        200,
        'Novice',
        JSON.stringify(['🔥 Community Contributor']),
        'Student builder and Techyogeek Nirvana member.',
        0,
        1,
        now,
        referralCode,
        0,
        now,
        now
      ]);

      await creditService.getOrCreateWallet(userId);

      if (referredByCode) {
        await creditService.processReferral(userId, cleanEmail, referredByCode);
      }

      user = await userService.getUserById(userId);
    } else {
      // If user exists and is in global admin list, elevate role
      if (isGlobalAdminEmail(cleanEmail) && user.role !== 'ADMIN') {
        await db.execute(`UPDATE users SET role = 'ADMIN', updated_at = ? WHERE id = ?`, [now, user.id]);
        user.role = 'ADMIN';
      }
      // Update name if name provided from Google or if user name needs sync
      const targetName = formatNameFromEmail(cleanEmail, name);
      if (targetName && targetName !== user.name) {
        await db.execute(`UPDATE users SET name = ?, updated_at = ? WHERE id = ?`, [targetName, now, user.id]);
        user.name = targetName;
      }

      // Sync username to Google handle / email prefix if legacy
      const expectedUsername = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (expectedUsername && (user.username === 'ishpreet_admin' || !user.username)) {
        await db.execute(`UPDATE users SET username = ?, updated_at = ? WHERE id = ?`, [expectedUsername, now, user.id]);
        user.username = expectedUsername;
      }

      // Google OAuth avatar sync: if Google provides an avatar, update immediately
      if (avatar && (avatar !== user.avatar || !user.avatar || user.avatar.includes('unsplash.com') || user.avatar.includes('tygn-logo.png'))) {
        await db.execute(`UPDATE users SET avatar = ?, updated_at = ? WHERE id = ?`, [avatar, now, user.id]);
        user.avatar = avatar;
      }

      // Ensure user has a referral code
      if (!user.referralCode) {
        const generatedCode = userService.generateReferralCode(user.username);
        await db.execute(`UPDATE users SET referral_code = ?, updated_at = ? WHERE id = ?`, [generatedCode, now, user.id]);
        user.referralCode = generatedCode;
      }

      // Process referral if user was not previously referred
      if (referredByCode && !user.referredBy) {
        await creditService.processReferral(user.id, cleanEmail, referredByCode);
        user = (await userService.getUserById(user.id))!;
      }

      await creditService.getOrCreateWallet(user.id);
    }

    if (user!.isSuspended) {
      throw new Error(`Account Banned: The account (${cleanEmail}) has been suspended by a platform administrator. You cannot log in.`);
    }

    // Generate Session
    const sessionId = 'sess_' + crypto.randomUUID();
    const token = signAuthToken({
      userId: user!.id,
      email: user!.email,
      role: user!.role,
      sessionId,
    });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await db.execute(`
      INSERT INTO user_sessions (id, user_id, token_hash, ip_address, user_agent, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [sessionId, user!.id, tokenHash, ip || null, userAgent || null, expiresAt, now]);

    return { user: user!, token };
  },

  async logoutSession(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await db.execute('DELETE FROM user_sessions WHERE token_hash = ?', [tokenHash]);
  },
};
