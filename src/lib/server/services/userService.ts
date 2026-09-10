import { db } from '../db/client';
import { User, UserRole } from '@/types';
import crypto from 'crypto';

function safeParseJson(val: any, fallback: any = []): any {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return fallback;
  }
}

export const userService = {
  mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      avatar: (row.avatar && !row.avatar.includes('unsplash.com'))
        ? row.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=0284c7&color=fff&bold=true`,
      role: row.role as UserRole,
      title: row.title || '',
      collegeOrCompany: row.college_or_company || '',
      education: row.education || '',
      skills: safeParseJson(row.skills, []),
      interests: safeParseJson(row.interests, []),
      github: row.github || '',
      linkedin: row.linkedin || '',
      portfolio: row.portfolio || '',
      experienceLevel: row.experience_level || 'Beginner',
      xp: row.xp || 0,
      level: row.level || 'Novice',
      badges: safeParseJson(row.badges, []),
      bio: row.bio || '',
      createdAt: row.created_at,
      isSuspended: Boolean(row.is_suspended),
      isEmailVerified: Boolean(row.is_email_verified),
      emailVerifiedAt: row.email_verified_at,
      referralCode: row.referral_code,
      referredBy: row.referred_by,
      referralCount: row.referral_count || 0,
    };
  },

  async getUserById(id: string): Promise<User | null> {
    const row = await db.queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    return row ? this.mapRowToUser(row) : null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const row = await db.queryOne('SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL', [email.toLowerCase().trim()]);
    return row ? this.mapRowToUser(row) : null;
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const row = await db.queryOne('SELECT * FROM users WHERE LOWER(username) = ? AND deleted_at IS NULL', [username.toLowerCase().trim()]);
    return row ? this.mapRowToUser(row) : null;
  },

  async getAllUsers(): Promise<User[]> {
    const rows = await db.queryAll('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return rows.map((r) => this.mapRowToUser(r));
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const current = await this.getUserById(id);
    if (!current) throw new Error('User not found.');

    const now = new Date().toISOString();
    const updated = { ...current, ...updates };

    await db.execute(`
      UPDATE users SET
        name = ?,
        avatar = ?,
        title = ?,
        college_or_company = ?,
        education = ?,
        skills = ?,
        interests = ?,
        github = ?,
        linkedin = ?,
        portfolio = ?,
        experience_level = ?,
        bio = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.name,
      updated.avatar,
      updated.title,
      updated.collegeOrCompany,
      updated.education,
      JSON.stringify(updated.skills),
      JSON.stringify(updated.interests),
      updated.github,
      updated.linkedin,
      updated.portfolio,
      updated.experienceLevel,
      updated.bio,
      now,
      id
    ]);

    const refreshed = await this.getUserById(id);
    return refreshed!;
  },

  async changeRole(targetUserId: string, newRole: UserRole, adminUser: User): Promise<void> {
    let target = await this.getUserById(targetUserId);
    if (!target) {
      const byEmail = await db.queryOne<{ id: string }>('SELECT id FROM users WHERE email = ? OR username = ?', [targetUserId, targetUserId]);
      if (byEmail) {
        target = await this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com' && newRole !== 'ADMIN') {
      throw new Error('The platform Lead Admin must remain an Administrator.');
    }

    const now = new Date().toISOString();
    await db.execute('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', [newRole, now, targetUserId]);

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'log_' + crypto.randomUUID(),
      now,
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'CHANGE_ROLE',
      'user',
      targetUserId,
      `Changed user role to ${newRole} for ${target.name} (${target.email})`,
      'success'
    ]);
  },

  async toggleSuspend(targetUserId: string, adminUser: User, explicitStatus?: boolean): Promise<boolean> {
    let target = await this.getUserById(targetUserId);
    if (!target) {
      const byEmail = await db.queryOne<{ id: string }>('SELECT id FROM users WHERE email = ? OR username = ?', [targetUserId, targetUserId]);
      if (byEmail) {
        target = await this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com') {
      throw new Error('The platform Lead Admin cannot be suspended.');
    }

    if (target.id === adminUser.id || (adminUser.email && target.email?.toLowerCase().trim() === adminUser.email?.toLowerCase().trim())) {
      throw new Error('You cannot suspend your own active administrator account.');
    }

    const newSuspended = explicitStatus !== undefined ? (explicitStatus ? 1 : 0) : (target.isSuspended ? 0 : 1);
    const now = new Date().toISOString();

    await db.execute('UPDATE users SET is_suspended = ?, updated_at = ? WHERE id = ?', [newSuspended, now, targetUserId]);

    // If suspending, immediately revoke all active sessions for this user
    if (newSuspended === 1) {
      await db.execute('DELETE FROM user_sessions WHERE user_id = ?', [targetUserId]);
    }

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'log_' + crypto.randomUUID(),
      now,
      adminUser.id,
      adminUser.name,
      adminUser.role,
      newSuspended ? 'SUSPEND_USER' : 'RESTORE_USER',
      'user',
      targetUserId,
      `${newSuspended ? 'Suspended (Banned)' : 'Restored'} access for user ${target.name} (${target.email})`,
      'warning'
    ]);

    return Boolean(newSuspended);
  },

  async deleteUser(targetUserId: string, adminUser: User): Promise<boolean> {
    let target = await this.getUserById(targetUserId);
    if (!target) {
      const byEmail = await db.queryOne<{ id: string }>('SELECT id FROM users WHERE email = ? OR username = ?', [targetUserId, targetUserId]);
      if (byEmail) {
        target = await this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com') {
      throw new Error('The platform Lead Admin cannot be deleted.');
    }

    if (target.id === adminUser.id || (adminUser.email && target.email?.toLowerCase().trim() === adminUser.email?.toLowerCase().trim())) {
      throw new Error('You cannot delete your own active administrator account.');
    }

    const now = new Date().toISOString();
    await db.execute('UPDATE users SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, targetUserId]);
    await db.execute('DELETE FROM user_sessions WHERE user_id = ?', [targetUserId]);

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'log_' + crypto.randomUUID(),
      now,
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'DELETE_USER',
      'user',
      targetUserId,
      `Deleted user account for ${target.name} (${target.email})`,
      'warning'
    ]);

    return true;
  },

  async adminUpdateUser(targetUserId: string, updates: Partial<User>, adminUser: User): Promise<User> {
    let target = await this.getUserById(targetUserId);
    if (!target) {
      const byEmail = await db.queryOne<{ id: string }>('SELECT id FROM users WHERE email = ? OR username = ?', [targetUserId, targetUserId]);
      if (byEmail) {
        target = await this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    const now = new Date().toISOString();
    const updated = { ...target, ...updates };

    await db.execute(`
      UPDATE users SET
        name = ?,
        avatar = ?,
        role = ?,
        title = ?,
        college_or_company = ?,
        education = ?,
        skills = ?,
        interests = ?,
        github = ?,
        linkedin = ?,
        portfolio = ?,
        experience_level = ?,
        badges = ?,
        bio = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.name,
      updated.avatar,
      updated.role,
      updated.title,
      updated.collegeOrCompany,
      updated.education,
      JSON.stringify(updated.skills || []),
      JSON.stringify(updated.interests || []),
      updated.github || '',
      updated.linkedin || '',
      updated.portfolio || '',
      updated.experienceLevel || 'Beginner',
      JSON.stringify(updated.badges || []),
      updated.bio || '',
      now,
      targetUserId
    ]);

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'log_' + crypto.randomUUID(),
      now,
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'UPDATE_USER',
      'user',
      targetUserId,
      `Admin updated profile for ${updated.name} (${updated.email})`,
      'success'
    ]);

    const refreshed = await this.getUserById(targetUserId);
    return refreshed!;
  },

  generateReferralCode(username: string): string {
    const prefix = username.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'TYGN';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TYGN-${prefix}-${rand}`;
  },
};
