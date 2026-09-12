import { db } from '../db/client';
import { NirvanaMoment, User, SubmissionStatus } from '@/types';
import crypto from 'crypto';

export const momentService = {
  async listMoments(limit = 20, offset = 0, includePending = false, authorId?: string): Promise<NirvanaMoment[]> {
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

    const rows = await db.queryAll(`
      SELECT 
        m.*, 
        COALESCE(u.name, 'Community Member') as user_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as user_avatar, 
        COALESCE(u.title, 'Developer & Member') as user_title
      FROM nirvana_moments m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE ${whereClause}
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const momentIds = rows.map(r => r.id);
    const likesMap: Record<string, string[]> = {};
    const commentsMap: Record<string, any[]> = {};

    if (momentIds.length > 0) {
      const placeholders = momentIds.map(() => '?').join(',');
      const likeRows = await db.queryAll(`SELECT moment_id, user_id FROM moment_likes WHERE moment_id IN (${placeholders})`, momentIds);
      for (const l of likeRows) {
        if (!likesMap[l.moment_id]) likesMap[l.moment_id] = [];
        likesMap[l.moment_id].push(l.user_id);
      }

      const commentRows = await db.queryAll(`
        SELECT 
          c.*, 
          COALESCE(u.name, 'Community Member') as user_name, 
          COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as user_avatar
        FROM moment_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.moment_id IN (${placeholders})
        ORDER BY c.created_at ASC
      `, momentIds);

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

  async createMoment(content: string, category: string, imageUrl: string | undefined, user: User, idOverride?: string): Promise<NirvanaMoment> {
    try {
      const { userService } = await import('./userService');
      await userService.ensureUserInDb(user);
    } catch (_) {}

    const id = idOverride || ('moment_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = user.role === 'ADMIN' ? 'approved' : 'pending';

    await db.execute(`
      INSERT INTO nirvana_moments (id, user_id, content, category, image_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, user.id, content.trim(), category, imageUrl || null, status, now, now]);

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

  async reviewMoment(id: string, status: 'approved' | 'rejected', rejectionReason?: string, reviewer?: User): Promise<boolean> {
    const now = new Date().toISOString();
    const res = await db.execute(`
      UPDATE nirvana_moments
      SET status = ?, rejection_reason = ?, updated_at = ?
      WHERE id = ?
    `, [status, rejectionReason || null, now, id]);
    return res.rowCount > 0;
  },

  async toggleLike(momentId: string, userId: string): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM moment_likes WHERE moment_id = ? AND user_id = ?', [momentId, userId]);

    if (existing) {
      await db.execute('DELETE FROM moment_likes WHERE moment_id = ? AND user_id = ?', [momentId, userId]);
      return false;
    } else {
      await db.execute('INSERT INTO moment_likes (moment_id, user_id, created_at) VALUES (?, ?, ?)', [momentId, userId, new Date().toISOString()]);
      return true;
    }
  },

  async addComment(momentId: string, content: string, user: User) {
    const id = 'c_' + crypto.randomUUID().slice(0, 10);
    const now = new Date().toISOString();

    await db.execute(`
      INSERT INTO moment_comments (id, moment_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, momentId, user.id, content.trim(), now]);

    return {
      id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: content.trim(),
      createdAt: now,
    };
  },

  async getMomentById(id: string): Promise<NirvanaMoment | null> {
    const row = await db.queryOne(`
      SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.title as user_title
      FROM nirvana_moments m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ? AND m.deleted_at IS NULL
    `, [id]);

    if (!row) return null;

    const likeRows = await db.queryAll('SELECT user_id FROM moment_likes WHERE moment_id = ?', [id]);
    const likedBy = likeRows.map(l => l.user_id);

    const commentRows = await db.queryAll(`
      SELECT c.*, u.name as user_name, u.avatar as user_avatar
      FROM moment_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.moment_id = ?
      ORDER BY c.created_at ASC
    `, [id]);

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

  async deleteMoment(id: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const target = await this.getMomentById(id);
    const result = await db.execute('UPDATE nirvana_moments SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
    if (result.rowCount > 0) {
      await db.execute(`
        INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
      ]);
      return true;
    }
    return false;
  },

  async updateMoment(id: string, updates: Partial<NirvanaMoment>, adminUser: User): Promise<NirvanaMoment> {
    const current = await this.getMomentById(id);
    if (!current) throw new Error('Moment not found.');

    const now = new Date().toISOString();
    const updated: NirvanaMoment = { ...current, ...updates };

    await db.execute(`
      UPDATE nirvana_moments SET
        content = ?,
        category = ?,
        image_url = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.content,
      updated.category,
      updated.imageUrl || null,
      updated.status || 'approved',
      now,
      id
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
      'UPDATE_MOMENT',
      'moment',
      id,
      `Modified moment ${id} by "${updated.userName}"`,
      'success'
    ]);

    const refreshed = await this.getMomentById(id);
    return refreshed!;
  },
};
