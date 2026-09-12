import { db } from '../db/client';
import { Project, User, SubmissionStatus } from '@/types';
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

export const projectService = {
  async listProjects(category?: string, limit = 50, offset = 0, includePending = false, authorId?: string): Promise<Project[]> {
    const conditions: string[] = ['(p.deleted_at IS NULL)'];
    const params: any[] = [];

    if (category && category !== 'All') {
      conditions.push('p.category = ?');
      params.push(category);
    }

    if (!includePending) {
      if (authorId) {
        conditions.push("(p.approval_status = 'approved' OR p.author_id = ?)");
        params.push(authorId);
      } else {
        conditions.push("(p.approval_status = 'approved' OR p.approval_status IS NULL)");
      }
    }

    const rows = await db.queryAll(`
      SELECT 
        p.*, 
        COALESCE(u.name, 'Community Member') as author_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as author_avatar
      FROM projects p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const projectIds = rows.map(r => r.id);
    const likesMap: Record<string, string[]> = {};

    if (projectIds.length > 0) {
      const placeholders = projectIds.map(() => '?').join(',');
      const likeRows = await db.queryAll(`SELECT project_id, user_id FROM project_likes WHERE project_id IN (${placeholders})`, projectIds);
      for (const l of likeRows) {
        if (!likesMap[l.project_id]) likesMap[l.project_id] = [];
        likesMap[l.project_id].push(l.user_id);
      }
    }

    return rows.map(r => {
      const likedUsers = likesMap[r.id] || [];
      const authorAvatar = (r.author_avatar && !r.author_avatar.includes('unsplash.com'))
        ? r.author_avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author_name || 'User')}&background=0284c7&color=fff&bold=true`;
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        techStack: safeParseJson(r.tech_stack, []),
        githubUrl: r.github_url,
        liveUrl: r.live_url || undefined,
        coverImage: r.cover_image || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
        authorId: r.author_id,
        authorName: r.author_name,
        authorAvatar,
        likes: likedUsers.length,
        likedBy: likedUsers,
        category: r.category as any,
        status: r.status as any,
        approvalStatus: (r.approval_status as SubmissionStatus) || 'approved',
        rejectionReason: r.rejection_reason || undefined,
        createdAt: r.created_at,
      };
    });
  },

  async createProject(data: Partial<Project>, user: User): Promise<Project> {
    try {
      const { userService } = await import('./userService');
      await userService.ensureUserInDb(user);
    } catch (_) {}

    const id = data.id || ('proj_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const approvalStatus: SubmissionStatus = 'approved';

    await db.execute(`
      INSERT INTO projects (
        id, title, description, tech_stack, github_url, live_url, cover_image, author_id, category, status, approval_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.title || 'Untitled Project',
      data.description || '',
      JSON.stringify(data.techStack || []),
      data.githubUrl || 'https://github.com',
      data.liveUrl || null,
      data.coverImage || null,
      user.id,
      data.category || 'Web',
      data.status || 'In Progress',
      approvalStatus,
      now,
      now
    ]);

    const authorAvatar = (user.avatar && !user.avatar.includes('unsplash.com'))
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0284c7&color=fff&bold=true`;

    return {
      id,
      title: data.title || 'Untitled Project',
      description: data.description || '',
      techStack: data.techStack || [],
      githubUrl: data.githubUrl || 'https://github.com',
      liveUrl: data.liveUrl,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      authorId: user.id,
      authorName: user.name,
      authorAvatar,
      likes: 0,
      likedBy: [],
      category: (data.category as any) || 'Web',
      status: (data.status as any) || 'In Progress',
      approvalStatus,
      createdAt: now,
    };
  },

  async reviewProject(id: string, status: 'approved' | 'rejected', rejectionReason?: string, reviewer?: User): Promise<boolean> {
    const now = new Date().toISOString();
    const res = await db.execute(`
      UPDATE projects
      SET approval_status = ?, rejection_reason = ?, updated_at = ?
      WHERE id = ?
    `, [status, rejectionReason || null, now, id]);
    return res.rowCount > 0;
  },

  async toggleLike(projectId: string, userId: string): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM project_likes WHERE project_id = ? AND user_id = ?', [projectId, userId]);

    if (existing) {
      await db.execute('DELETE FROM project_likes WHERE project_id = ? AND user_id = ?', [projectId, userId]);
      return false;
    } else {
      await db.execute('INSERT INTO project_likes (project_id, user_id, created_at) VALUES (?, ?, ?)', [projectId, userId, new Date().toISOString()]);
      return true;
    }
  },

  async getProjectById(id: string): Promise<Project | null> {
    const row = await db.queryOne(`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar
      FROM projects p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `, [id]);

    if (!row) return null;

    const likeRows = await db.queryAll('SELECT user_id FROM project_likes WHERE project_id = ?', [id]);
    const likedBy = likeRows.map(l => l.user_id);
    const authorAvatar = (row.author_avatar && !row.author_avatar.includes('unsplash.com'))
      ? row.author_avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.author_name || 'User')}&background=0284c7&color=fff&bold=true`;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      techStack: safeParseJson(row.tech_stack, []),
      githubUrl: row.github_url,
      liveUrl: row.live_url || undefined,
      coverImage: row.cover_image || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      authorId: row.author_id,
      authorName: row.author_name,
      authorAvatar,
      likes: likedBy.length,
      likedBy,
      category: row.category,
      status: row.status,
      approvalStatus: row.approval_status,
      rejectionReason: row.rejection_reason || undefined,
      createdAt: row.created_at,
    };
  },

  async deleteProject(id: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const target = await this.getProjectById(id);
    const result = await db.execute('UPDATE projects SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
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
        'DELETE_PROJECT',
        'project',
        id,
        `Deleted project "${target?.title || id}"`,
        'warning'
      ]);
      return true;
    }
    return false;
  },

  async updateProject(id: string, updates: Partial<Project>, adminUser: User): Promise<Project> {
    const current = await this.getProjectById(id);
    if (!current) throw new Error('Project not found.');

    const now = new Date().toISOString();
    const updated: Project = { ...current, ...updates };

    await db.execute(`
      UPDATE projects SET
        title = ?,
        description = ?,
        tech_stack = ?,
        github_url = ?,
        live_url = ?,
        cover_image = ?,
        category = ?,
        status = ?,
        approval_status = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.title,
      updated.description,
      JSON.stringify(updated.techStack || []),
      updated.githubUrl,
      updated.liveUrl || null,
      updated.coverImage || null,
      updated.category,
      updated.status,
      updated.approvalStatus || 'approved',
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
      'UPDATE_PROJECT',
      'project',
      id,
      `Modified project ${id}: "${updated.title}"`,
      'success'
    ]);

    const refreshed = await this.getProjectById(id);
    return refreshed!;
  },
};
