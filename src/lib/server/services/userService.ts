import { getDatabase } from '../db/client';
import { User, UserRole } from '@/types';
import crypto from 'crypto';

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
      skills: JSON.parse(row.skills || '[]'),
      interests: JSON.parse(row.interests || '[]'),
      github: row.github || '',
      linkedin: row.linkedin || '',
      portfolio: row.portfolio || '',
      experienceLevel: row.experience_level || 'Beginner',
      xp: row.xp || 0,
      level: row.level || 'Novice',
      badges: JSON.parse(row.badges || '[]'),
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

  getUserById(id: string): User | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL').get(id);
    return row ? this.mapRowToUser(row) : null;
  },

  getUserByEmail(email: string): User | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL').get(email.toLowerCase().trim());
    return row ? this.mapRowToUser(row) : null;
  },

  getUserByUsername(username: string): User | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE LOWER(username) = ? AND deleted_at IS NULL').get(username.toLowerCase().trim());
    return row ? this.mapRowToUser(row) : null;
  },

  getAllUsers(): User[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC').all();
    return rows.map((r) => this.mapRowToUser(r));
  },

  updateUser(id: string, updates: Partial<User>): User {
    const db = getDatabase();
    const current = this.getUserById(id);
    if (!current) throw new Error('User not found.');

    const now = new Date().toISOString();
    const updated = { ...current, ...updates };

    db.prepare(`
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
    `).run(
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
    );

    return this.getUserById(id)!;
  },

  changeRole(targetUserId: string, newRole: UserRole, adminUser: User): void {
    const db = getDatabase();
    let target = this.getUserById(targetUserId);
    if (!target) {
      const byEmail = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(targetUserId, targetUserId) as any;
      if (byEmail) {
        target = this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com' && newRole !== 'ADMIN') {
      throw new Error('The platform Lead Admin must remain an Administrator.');
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(newRole, now, targetUserId);

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );
  },

  toggleSuspend(targetUserId: string, adminUser: User, explicitStatus?: boolean): boolean {
    const db = getDatabase();
    let target = this.getUserById(targetUserId);
    if (!target) {
      const byEmail = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(targetUserId, targetUserId) as any;
      if (byEmail) {
        target = this.getUserById(byEmail.id);
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

    db.prepare('UPDATE users SET is_suspended = ?, updated_at = ? WHERE id = ?').run(newSuspended, now, targetUserId);

    // If suspending, immediately revoke all active sessions for this user
    if (newSuspended === 1) {
      db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(targetUserId);
    }

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return Boolean(newSuspended);
  },

  deleteUser(targetUserId: string, adminUser: User): boolean {
    const db = getDatabase();
    let target = this.getUserById(targetUserId);
    if (!target) {
      const byEmail = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(targetUserId, targetUserId) as any;
      if (byEmail) {
        target = this.getUserById(byEmail.id);
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
    db.prepare('UPDATE users SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now, now, targetUserId);
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(targetUserId);

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return true;
  },

  adminUpdateUser(targetUserId: string, updates: Partial<User>, adminUser: User): User {
    const db = getDatabase();
    let target = this.getUserById(targetUserId);
    if (!target) {
      const byEmail = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(targetUserId, targetUserId) as any;
      if (byEmail) {
        target = this.getUserById(byEmail.id);
        targetUserId = byEmail.id;
      }
    }
    if (!target) throw new Error('User not found.');

    const now = new Date().toISOString();
    const updated = { ...target, ...updates };

    db.prepare(`
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
    `).run(
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
    );

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return this.getUserById(targetUserId)!;
  },

  generateReferralCode(username: string): string {
    const prefix = username.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'TYGN';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TYGN-${prefix}-${rand}`;
  },
};
