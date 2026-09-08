import { getDatabase } from '../db/client';
import { Opportunity, SubmissionStatus, User, UserRole } from '@/types';
import crypto from 'crypto';

export interface OpportunityFilter {
  status?: SubmissionStatus;
  type?: string;
  search?: string;
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

export const oppService = {
  mapRow(row: any): Opportunity {
    const db = getDatabase();
    const savedUsers = db.prepare('SELECT user_id FROM opportunity_saves WHERE opportunity_id = ?').all(row.id) as { user_id: string }[];

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
      skills: JSON.parse(row.skills || '[]'),
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

  listOpportunities(filter: OpportunityFilter = {}): { items: Opportunity[]; total: number } {
    const db = getDatabase();
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

    const countRow = db.prepare(`
      SELECT COUNT(*) as count FROM opportunities o WHERE ${whereClause}
    `).get(...params) as { count: number };

    const rows = db.prepare(`
      SELECT o.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM opportunities o
      JOIN users u ON o.posted_by_user_id = u.id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    return {
      items: rows.map(r => this.mapRow(r)),
      total: countRow.count,
    };
  },

  createOpportunity(data: Partial<Opportunity>, user: User): Opportunity {
    const db = getDatabase();
    const id = data.id || ('opp_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = 'pending';

    db.prepare(`
      INSERT INTO opportunities (
        id, title, company, company_logo, type, location, is_remote, experience,
        stipend_or_salary, skills, description, apply_url, deadline, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return this.getOpportunityById(id)!;
  },

  getOpportunityById(id: string): Opportunity | null {
    const db = getDatabase();
    const row = db.prepare(`
      SELECT o.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM opportunities o
      JOIN users u ON o.posted_by_user_id = u.id
      WHERE o.id = ? AND o.deleted_at IS NULL
    `).get(id);

    return row ? this.mapRow(row) : null;
  },

  reviewOpportunity(id: string, newStatus: SubmissionStatus, adminUser: User, rejectionReason?: string): Opportunity {
    const db = getDatabase();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE opportunities SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?
    `).run(newStatus, rejectionReason || null, now, id);

    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return this.getOpportunityById(id)!;
  },

  toggleSave(opportunityId: string, userId: string): boolean {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM opportunity_saves WHERE user_id = ? AND opportunity_id = ?').get(userId, opportunityId);

    if (existing) {
      db.prepare('DELETE FROM opportunity_saves WHERE user_id = ? AND opportunity_id = ?').run(userId, opportunityId);
      return false;
    } else {
      db.prepare('INSERT INTO opportunity_saves (user_id, opportunity_id, created_at) VALUES (?, ?, ?)').run(userId, opportunityId, new Date().toISOString());
      return true;
    }
  },

  deleteOpportunity(id: string, adminUser: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const target = this.getOpportunityById(id);
    const result = db.prepare('UPDATE opportunities SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now, now, id);
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
        'DELETE_OPPORTUNITY',
        'opportunity',
        id,
        `Deleted opportunity "${target?.title || id}" at "${target?.company || 'N/A'}"`,
        'warning'
      );
      return true;
    }
    return false;
  },

  updateOpportunity(id: string, updates: Partial<Opportunity>, adminUser: User): Opportunity {
    const db = getDatabase();
    const current = this.getOpportunityById(id);
    if (!current) throw new Error('Opportunity not found.');

    const now = new Date().toISOString();
    const updated: Opportunity = { ...current, ...updates };

    db.prepare(`
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
    `).run(
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
      'UPDATE_OPPORTUNITY',
      'opportunity',
      id,
      `Modified opportunity ${id}: "${updated.title}" at ${updated.company}`,
      'success'
    );

    return this.getOpportunityById(id)!;
  },
};
