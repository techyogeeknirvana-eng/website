import { db } from '../db/client';
import { Opportunity, SubmissionStatus, User, UserRole } from '@/types';
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

export interface OpportunityFilter {
  status?: SubmissionStatus;
  type?: string;
  search?: string;
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

export const oppService = {
  async mapRow(row: any): Promise<Opportunity> {
    const savedUsers = await db.queryAll<{ user_id: string }>(
      'SELECT user_id FROM opportunity_saves WHERE opportunity_id = ?',
      [row.id]
    );

    return {
      id: row.id,
      title: row.title,
      company: row.company,
      companyLogo: row.company_logo || 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80',
      type: row.type,
      location: row.location,
      isRemote: Boolean(row.is_remote),
      experience: row.experience || '',
      stipendOrSalary: row.stipend_or_salary || '',
      skills: safeParseJson(row.skills, []),
      description: row.description,
      applyUrl: row.apply_url,
      deadline: row.deadline,
      postedBy: {
        id: row.poster_id,
        name: row.poster_name,
        avatar: row.poster_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: row.poster_role as UserRole,
      },
      status: row.status as SubmissionStatus,
      rejectionReason: row.rejection_reason || undefined,
      createdAt: row.created_at,
      savedBy: savedUsers.map(s => s.user_id),
    };
  },

  async listOpportunities(filter: OpportunityFilter = {}): Promise<{ items: Opportunity[]; total: number }> {
    const page = Math.max(1, filter.page || 1);
    const limit = Math.min(100, Math.max(1, filter.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['o.deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.status) {
      conditions.push('o.status = ?');
      params.push(filter.status);
    } else {
      // Default to approved if not filtering
      conditions.push("o.status = 'approved'");
    }

    if (filter.type) {
      conditions.push('o.type = ?');
      params.push(filter.type);
    }

    if (filter.isRemote !== undefined) {
      conditions.push('o.is_remote = ?');
      params.push(filter.isRemote ? 1 : 0);
    }

    if (filter.search) {
      conditions.push('(o.title LIKE ? OR o.company LIKE ? OR o.description LIKE ?)');
      const q = `%${filter.search.trim()}%`;
      params.push(q, q, q);
    }

    const whereClause = conditions.join(' AND ');

    const countRow = await db.queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM opportunities o WHERE ${whereClause}
    `, params);

    const rows = await db.queryAll(`
      SELECT o.*, 
        COALESCE(u.id, o.posted_by_user_id) as poster_id, 
        COALESCE(u.name, 'Community Member') as poster_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as poster_avatar, 
        COALESCE(u.role, 'USER') as poster_role
      FROM opportunities o
      LEFT JOIN users u ON o.posted_by_user_id = u.id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const items = await Promise.all(rows.map(r => this.mapRow(r)));

    return {
      items,
      total: countRow ? Number(countRow.count) : 0,
    };
  },

  async createOpportunity(data: Partial<Opportunity>, user: User): Promise<Opportunity> {
    const id = data.id || ('opp_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = 'approved';

    await db.execute(`
      INSERT INTO opportunities (
        id, title, company, company_logo, type, location, is_remote, experience,
        stipend_or_salary, skills, description, apply_url, deadline, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.title || 'Untitled Opportunity',
      data.company || 'Company',
      data.companyLogo || null,
      data.type || 'job',
      data.location || 'Remote',
      data.isRemote ? 1 : 0,
      data.experience || '',
      data.stipendOrSalary || '',
      JSON.stringify(data.skills || []),
      data.description || '',
      data.applyUrl || 'https://nirvana.community',
      data.deadline || now.slice(0, 10),
      user.id,
      status,
      now,
      now
    ]);

    const opp = await this.getOpportunityById(id);
    return opp!;
  },

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const row = await db.queryOne(`
      SELECT o.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM opportunities o
      JOIN users u ON o.posted_by_user_id = u.id
      WHERE o.id = ? AND o.deleted_at IS NULL
    `, [id]);

    return row ? await this.mapRow(row) : null;
  },

  async reviewOpportunity(id: string, newStatus: SubmissionStatus, adminUser: User, rejectionReason?: string): Promise<Opportunity> {
    const now = new Date().toISOString();

    await db.execute(`
      UPDATE opportunities SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?
    `, [newStatus, rejectionReason || null, now, id]);

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'log_' + crypto.randomUUID(),
      now,
      adminUser.id,
      adminUser.name,
      adminUser.role,
      newStatus === 'approved' ? 'APPROVE_OPPORTUNITY' : 'REJECT_OPPORTUNITY',
      'opportunity',
      id,
      `Reviewed opportunity. Set status to ${newStatus}`,
      'success'
    ]);

    const opp = await this.getOpportunityById(id);
    return opp!;
  },

  async toggleSave(opportunityId: string, userId: string): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM opportunity_saves WHERE user_id = ? AND opportunity_id = ?', [userId, opportunityId]);

    if (existing) {
      await db.execute('DELETE FROM opportunity_saves WHERE user_id = ? AND opportunity_id = ?', [userId, opportunityId]);
      return false;
    } else {
      await db.execute('INSERT INTO opportunity_saves (user_id, opportunity_id, created_at) VALUES (?, ?, ?)', [userId, opportunityId, new Date().toISOString()]);
      return true;
    }
  },

  async deleteOpportunity(id: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const target = await this.getOpportunityById(id);
    const result = await db.execute('UPDATE opportunities SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
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
        'DELETE_OPPORTUNITY',
        'opportunity',
        id,
        `Deleted opportunity "${target?.title || id}" at "${target?.company || 'N/A'}"`,
        'warning'
      ]);
      return true;
    }
    return false;
  },

  async updateOpportunity(id: string, updates: Partial<Opportunity>, adminUser: User): Promise<Opportunity> {
    const current = await this.getOpportunityById(id);
    if (!current) throw new Error('Opportunity not found.');

    const now = new Date().toISOString();
    const updated: Opportunity = { ...current, ...updates };

    await db.execute(`
      UPDATE opportunities SET
        title = ?,
        company = ?,
        company_logo = ?,
        type = ?,
        location = ?,
        is_remote = ?,
        experience = ?,
        stipend_or_salary = ?,
        skills = ?,
        description = ?,
        apply_url = ?,
        deadline = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.title,
      updated.company,
      updated.companyLogo || null,
      updated.type,
      updated.location,
      updated.isRemote ? 1 : 0,
      updated.experience,
      updated.stipendOrSalary,
      JSON.stringify(updated.skills || []),
      updated.description,
      updated.applyUrl,
      updated.deadline,
      updated.status,
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
      'UPDATE_OPPORTUNITY',
      'opportunity',
      id,
      `Modified opportunity ${id}: "${updated.title}" at ${updated.company}`,
      'success'
    ]);

    const opp = await this.getOpportunityById(id);
    return opp!;
  },
};
