import { db } from '../db/client';
import { CollabRequest, User } from '@/types';
import { userService } from './userService';
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

export const collabService = {
  mapRow(row: any): CollabRequest {
    const avatar = (row.organizer_avatar && !row.organizer_avatar.includes('unsplash.com'))
      ? row.organizer_avatar
      : (row.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    return {
      id: row.id,
      title: row.title,
      organizerId: row.organizer_id,
      organizerName: row.organizer_name || row.user_name || 'TechYOGeek Member',
      organizerAvatar: avatar,
      organizerRole: row.organizer_role || row.user_title || 'Developer & Member',
      hackathonOrProject: row.hackathon_or_project,
      roleNeeded: row.role_needed,
      requiredSkills: safeParseJson(row.required_skills, []),
      description: row.description,
      deadline: row.deadline,
      applicantsCount: Number(row.applicants_count || 0),
      status: (row.status || 'open') as 'open' | 'filled',
      createdAt: row.created_at,
    };
  },

  async listCollabRequests(status?: string, limit = 100): Promise<CollabRequest[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== 'all') {
      conditions.push('c.status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await db.queryAll(`
      SELECT 
        c.*, 
        u.name as user_name, 
        u.avatar as user_avatar, 
        u.title as user_title
      FROM collab_requests c
      LEFT JOIN users u ON c.organizer_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [...params, limit]);

    return rows.map(r => this.mapRow(r));
  },

  async getCollabRequestById(id: string): Promise<CollabRequest | null> {
    const row = await db.queryOne(`
      SELECT 
        c.*, 
        u.name as user_name, 
        u.avatar as user_avatar, 
        u.title as user_title
      FROM collab_requests c
      LEFT JOIN users u ON c.organizer_id = u.id
      WHERE c.id = ?
    `, [id]);

    if (!row) return null;
    return this.mapRow(row);
  },

  async createCollabRequest(data: Partial<CollabRequest>, authUser: User): Promise<CollabRequest> {
    // Ensure author exists in DB to prevent foreign key errors
    await userService.ensureUserInDb(authUser);

    const id = data.id || ('collab_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const cleanSkills = Array.isArray(data.requiredSkills) 
      ? data.requiredSkills 
      : (typeof data.requiredSkills === 'string' ? (data.requiredSkills as string).split(',').map((s: string) => s.trim()).filter(Boolean) : []);

    const title = data.title || 'Teammate Request';
    const organizerRole = data.organizerRole || authUser.title || 'Developer';
    const hackathonOrProject = data.hackathonOrProject || 'Hackathon / Project';
    const roleNeeded = data.roleNeeded || 'Full Stack Engineer';
    const description = data.description || '';
    const deadline = data.deadline || 'Ongoing';
    const status = data.status || 'open';
    const applicantsCount = data.applicantsCount || 0;

    await db.execute(`
      INSERT INTO collab_requests (
        id, title, organizer_id, organizer_name, organizer_avatar, organizer_role,
        hackathon_or_project, role_needed, required_skills, description, deadline,
        status, applicants_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title,
      authUser.id,
      authUser.name,
      authUser.avatar,
      organizerRole,
      hackathonOrProject,
      roleNeeded,
      JSON.stringify(cleanSkills),
      description,
      deadline,
      status,
      applicantsCount,
      now
    ]);

    return {
      id,
      title,
      organizerId: authUser.id,
      organizerName: authUser.name,
      organizerAvatar: authUser.avatar,
      organizerRole,
      hackathonOrProject,
      roleNeeded,
      requiredSkills: cleanSkills,
      description,
      deadline,
      applicantsCount,
      status: status as 'open' | 'filled',
      createdAt: now,
    };
  },

  async applyToCollabRequest(id: string, applicantUser: User): Promise<{ success: boolean; applicantsCount: number }> {
    await userService.ensureUserInDb(applicantUser);

    const req = await this.getCollabRequestById(id);
    if (!req) {
      throw new Error('Collab request not found');
    }

    const newCount = req.applicantsCount + 1;
    await db.execute(`
      UPDATE collab_requests
      SET applicants_count = ?
      WHERE id = ?
    `, [newCount, id]);

    return { success: true, applicantsCount: newCount };
  },

  async deleteCollabRequest(id: string, authUser: User): Promise<boolean> {
    const req = await this.getCollabRequestById(id);
    if (!req) return false;

    if (req.organizerId !== authUser.id && authUser.role !== 'ADMIN') {
      throw new Error('Forbidden: You can only delete your own collaboration requests.');
    }

    await db.execute('DELETE FROM collab_requests WHERE id = ?', [id]);
    return true;
  },

  async updateCollabStatus(id: string, status: 'open' | 'filled', authUser: User): Promise<boolean> {
    const req = await this.getCollabRequestById(id);
    if (!req) return false;

    if (req.organizerId !== authUser.id && authUser.role !== 'ADMIN') {
      throw new Error('Forbidden: Only the organizer or an admin can update this collaboration request.');
    }

    await db.execute('UPDATE collab_requests SET status = ? WHERE id = ?', [status, id]);
    return true;
  }
};
