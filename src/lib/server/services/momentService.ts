import { getDatabase } from '../db/client';
import { NirvanaMoment, User, SubmissionStatus } from '@/types';
import crypto from 'crypto';

export const momentService = {
  listMoments(limit = 20, offset = 0, includePending = false, authorId?: string): NirvanaMoment[] {
    const db = getDatabase();
    
    let whereClause = 'm.deleted_at IS NULL';
    const params: any[] = [];

    if (!includePending) {
      if (authorId) {
        whereClause += " AND (m.status = 'approved' OR m.user_id = ?)";
        params.push(authorId);
      } else {
        whereClause += " AND (m.status = 'approved' OR m.status IS NULL)";
      }
    }

    const rows = db.prepare(`
      SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.title as user_title
      FROM nirvana_moments m
      JOIN users u ON m.user_id = u.id
      WHERE ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as any[];

    const momentIds = rows.map(r => r.id);
    const likesMap: Record<string, string[]> = {};
    const commentsMap: Record<string, any[]> = {};

    if (momentIds.length > 0) {
      const placeholders = momentIds.map(() => '?').join(',');
      const likeRows = db.prepare(`SELECT moment_id, user_id FROM moment_likes WHERE moment_id IN (${placeholders})`).all(...momentIds) as any[];
      for (const l of likeRows) {
        if (!likesMap[l.moment_id]) likesMap[l.moment_id] = [];
        likesMap[l.moment_id].push(l.user_id);
      }

      const commentRows = db.prepare(`
        SELECT c.*, u.name as user_name, u.avatar as user_avatar
        FROM moment_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.moment_id IN (${placeholders})
        ORDER BY c.created_at ASC
      `).all(...momentIds) as any[];

      for (const c of commentRows) {
        if (!commentsMap[c.moment_id]) commentsMap[c.moment_id] = [];
        const authorAvatar = (c.user_avatar && !c.user_avatar.includes('unsplash.com'))
          ? c.user_avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user_name || 'User')}&background=0284c7&color=fff&bold=true`;
        commentsMap[c.moment_id].push({
          id: c.id,
          userId: c.user_id,
          userName: c.user_name,
          userAvatar: authorAvatar,
          content: c.content,
          createdAt: c.created_at,
        });
      }
    }

    return rows.map(r => {
      const likedUsers = likesMap[r.id] || [];
      const userAvatar = (r.user_avatar && !r.user_avatar.includes('unsplash.com'))
        ? r.user_avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user_name || 'User')}&background=0284c7&color=fff&bold=true`;
      return {
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        userAvatar,
        userTitle: r.user_title || 'Student Builder',
        content: r.content,
        category: r.category as any,
        imageUrl: r.image_url || undefined,
        likesCount: likedUsers.length,
        likedBy: likedUsers,
        comments: commentsMap[r.id] || [],
        status: (r.status as SubmissionStatus) || 'approved',
        rejectionReason: r.rejection_reason || undefined,
        createdAt: r.created_at,
      };
    });
  },

  createMoment(content: string, category: string, imageUrl: string | undefined, user: User, idOverride?: string): NirvanaMoment {
    const db = getDatabase();
    const id = idOverride || ('moment_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = 'pending';

    db.prepare(`
      INSERT INTO nirvana_moments (id, user_id, content, category, image_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, content.trim(), category, imageUrl || null, status, now, now);

    const userAvatar = (user.avatar && !user.avatar.includes('unsplash.com'))
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0284c7&color=fff&bold=true`;

    return {
      id,
      userId: user.id,
      userName: user.name,
      userAvatar,
      userTitle: user.title,
      content: content.trim(),
      category: category as any,
      imageUrl,
      likesCount: 0,
      likedBy: [],
      comments: [],
      status,
      createdAt: now,
    };
  },

  reviewMoment(id: string, status: 'approved' | 'rejected', rejectionReason?: string, reviewer?: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const res = db.prepare(`
      UPDATE nirvana_moments
      SET status = ?, rejection_reason = ?, updated_at = ?
      WHERE id = ?
    `).run(status, rejectionReason || null, now, id);
    return res.changes > 0;
  },

  toggleLike(momentId: string, userId: string): boolean {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM moment_likes WHERE moment_id = ? AND user_id = ?').get(momentId, userId);

    if (existing) {
      db.prepare('DELETE FROM moment_likes WHERE moment_id = ? AND user_id = ?').run(momentId, userId);
      return false;
    } else {
      db.prepare('INSERT INTO moment_likes (moment_id, user_id, created_at) VALUES (?, ?, ?)').run(momentId, userId, new Date().toISOString());
      return true;
    }
  },

  addComment(momentId: string, content: string, user: User) {
    const db = getDatabase();
    const id = 'c_' + crypto.randomUUID().slice(0, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO moment_comments (id, moment_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, momentId, user.id, content.trim(), now);

    return {
      id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: content.trim(),
      createdAt: now,
    };
  },

  getMomentById(id: string): NirvanaMoment | null {
    const db = getDatabase();
    const row = db.prepare(`
      SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.title as user_title
      FROM nirvana_moments m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ? AND m.deleted_at IS NULL
    `).get(id) as any;

    if (!row) return null;

    const likeRows = db.prepare('SELECT user_id FROM moment_likes WHERE moment_id = ?').all(id) as any[];
    const likedBy = likeRows.map(l => l.user_id);

    const commentRows = db.prepare(`
      SELECT c.*, u.name as user_name, u.avatar as user_avatar
      FROM moment_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.moment_id = ?
      ORDER BY c.created_at ASC
    `).all(id) as any[];

    const comments = commentRows.map(c => ({
      id: c.id,
      userId: c.user_id,
      userName: c.user_name,
      userAvatar: (c.user_avatar && !c.user_avatar.includes('unsplash.com'))
        ? c.user_avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user_name || 'User')}&background=0284c7&color=fff&bold=true`,
      content: c.content,
      createdAt: c.created_at,
    }));

    const userAvatar = (row.user_avatar && !row.user_avatar.includes('unsplash.com'))
      ? row.user_avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user_name || 'User')}&background=0284c7&color=fff&bold=true`;

    return {
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userAvatar,
      userTitle: row.user_title || '',
      content: row.content,
      category: row.category,
      imageUrl: row.image_url || undefined,
      likesCount: likedBy.length,
      likedBy,
      comments,
      status: row.status,
      rejectionReason: row.rejection_reason || undefined,
      createdAt: row.created_at,
    };
  },

  deleteMoment(id: string, adminUser: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const target = this.getMomentById(id);
    const result = db.prepare('UPDATE nirvana_moments SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now, now, id);
    if (result.changes > 0) {
      db.prepare(`
        INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'log_' + crypto.randomUUID(),
        now,
        adminUser.id,
        adminUser.name,
        adminUser.role,
        'DELETE_MOMENT',
        'moment',
        id,
        `Deleted moment ${id} by "${target?.userName || 'User'}"`,
        'warning'
      );
      return true;
    }
    return false;
  },

  updateMoment(id: string, updates: Partial<NirvanaMoment>, adminUser: User): NirvanaMoment {
    const db = getDatabase();
    const current = this.getMomentById(id);
    if (!current) throw new Error('Moment not found.');

    const now = new Date().toISOString();
    const updated: NirvanaMoment = { ...current, ...updates };

    db.prepare(`
      UPDATE nirvana_moments SET
        content = ?,
        category = ?,
        image_url = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      updated.content,
      updated.category,
      updated.imageUrl || null,
      updated.status || 'approved',
      now,
      id
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
      'UPDATE_MOMENT',
      'moment',
      id,
      `Modified moment ${id} by "${updated.userName}"`,
      'success'
    );

    return this.getMomentById(id)!;
  },
};
