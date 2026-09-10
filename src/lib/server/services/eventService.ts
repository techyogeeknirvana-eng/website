import { db } from '../db/client';
import { CommunityEvent, EventCategory, SubmissionStatus, User, UserRole } from '@/types';
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

export interface EventFilter {
  status?: SubmissionStatus;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  async mapRow(row: any): Promise<CommunityEvent> {
    const registrations = await db.queryAll<{ user_id: string }>(
      'SELECT user_id FROM event_registrations WHERE event_id = ?',
      [row.id]
    );

    return {
      id: row.id,
      title: row.title,
      category: row.category as EventCategory,
      organizer: row.organizer,
      organizerLogo: row.organizer_logo || undefined,
      date: row.date,
      time: row.time,
      location: row.location,
      isOnline: Boolean(row.is_online),
      registrationDeadline: row.registration_deadline,
      description: row.description,
      eligibility: row.eligibility || 'Open to all students',
      skills: safeParseJson(row.skills, []),
      registrationUrl: row.registration_url,
      participantsCount: registrations.length + (row.max_participants ? Math.min(row.max_participants, 15) : 10),
      maxParticipants: row.max_participants || undefined,
      bannerImage: row.banner_image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      postedBy: {
        id: row.poster_id,
        name: row.poster_name,
        avatar: row.poster_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: row.poster_role as UserRole,
      },
      status: row.status as SubmissionStatus,
      rejectionReason: row.rejection_reason || undefined,
      createdAt: row.created_at,
      registeredUsers: registrations.map(r => r.user_id),
    };
  },

  async listEvents(filter: EventFilter = {}): Promise<{ items: CommunityEvent[]; total: number }> {
    const page = Math.max(1, filter.page || 1);
    const limit = Math.min(100, Math.max(1, filter.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['e.deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.status) {
      conditions.push('e.status = ?');
      params.push(filter.status);
    } else {
      conditions.push("e.status = 'approved'");
    }

    if (filter.category) {
      conditions.push('e.category = ?');
      params.push(filter.category);
    }

    if (filter.search) {
      conditions.push('(e.title LIKE ? OR e.organizer LIKE ? OR e.description LIKE ?)');
      const q = `%${filter.search.trim()}%`;
      params.push(q, q, q);
    }

    const whereClause = conditions.join(' AND ');

    const countRow = await db.queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM community_events e WHERE ${whereClause}
    `, params);

    const rows = await db.queryAll(`
      SELECT e.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM community_events e
      JOIN users u ON e.posted_by_user_id = u.id
      WHERE ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const items = await Promise.all(rows.map(r => this.mapRow(r)));

    return {
      items,
      total: countRow ? Number(countRow.count) : 0,
    };
  },

  async createEvent(data: Partial<CommunityEvent>, user: User): Promise<CommunityEvent> {
    const id = data.id || ('event_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = 'pending';

    await db.execute(`
      INSERT INTO community_events (
        id, title, category, organizer, organizer_logo, date, time, location,
        is_online, registration_deadline, description, eligibility, skills,
        registration_url, max_participants, banner_image, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.title || 'Untitled Community Event',
      data.category || 'Workshops',
      data.organizer || user.name,
      data.organizerLogo || null,
      data.date || now.slice(0, 10),
      data.time || '18:00 IST',
      data.location || 'Online',
      data.isOnline === false ? 0 : 1,
      data.registrationDeadline || now.slice(0, 10),
      data.description || '',
      data.eligibility || 'Open to all students',
      JSON.stringify(data.skills || []),
      data.registrationUrl || 'https://nirvana.community',
      data.maxParticipants || null,
      data.bannerImage || null,
      user.id,
      status,
      now,
      now
    ]);

    const evt = await this.getEventById(id);
    return evt!;
  },

  async getEventById(id: string): Promise<CommunityEvent | null> {
    const row = await db.queryOne(`
      SELECT e.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM community_events e
      JOIN users u ON e.posted_by_user_id = u.id
      WHERE e.id = ? AND e.deleted_at IS NULL
    `, [id]);

    return row ? await this.mapRow(row) : null;
  },

  async reviewEvent(id: string, newStatus: SubmissionStatus, adminUser: User, rejectionReason?: string): Promise<CommunityEvent> {
    const now = new Date().toISOString();

    await db.execute(`
      UPDATE community_events SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?
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
      newStatus === 'approved' ? 'APPROVE_EVENT' : 'REJECT_EVENT',
      'event',
      id,
      `Reviewed community event. Set status to ${newStatus}`,
      'success'
    ]);

    const evt = await this.getEventById(id);
    return evt!;
  },

  async toggleRSVP(eventId: string, userId: string): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);

    if (existing) {
      await db.execute('DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);
      return false;
    } else {
      await db.execute('INSERT INTO event_registrations (user_id, event_id, created_at) VALUES (?, ?, ?)', [userId, eventId, new Date().toISOString()]);
      return true;
    }
  },

  async deleteEvent(id: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const target = await this.getEventById(id);
    const result = await db.execute('UPDATE community_events SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, id]);
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
        'DELETE_EVENT',
        'event',
        id,
        `Deleted event "${target?.title || id}" by "${target?.organizer || 'N/A'}"`,
        'warning'
      ]);
      return true;
    }
    return false;
  },

  async updateEvent(id: string, updates: Partial<CommunityEvent>, adminUser: User): Promise<CommunityEvent> {
    const current = await this.getEventById(id);
    if (!current) throw new Error('Event not found.');

    const now = new Date().toISOString();
    const updated: CommunityEvent = { ...current, ...updates };

    await db.execute(`
      UPDATE community_events SET
        title = ?,
        category = ?,
        organizer = ?,
        organizer_logo = ?,
        date = ?,
        time = ?,
        location = ?,
        is_online = ?,
        registration_deadline = ?,
        description = ?,
        eligibility = ?,
        skills = ?,
        registration_url = ?,
        max_participants = ?,
        banner_image = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      updated.title,
      updated.category,
      updated.organizer,
      updated.organizerLogo || null,
      updated.date,
      updated.time,
      updated.location,
      updated.isOnline ? 1 : 0,
      updated.registrationDeadline,
      updated.description,
      updated.eligibility || 'Open to all',
      JSON.stringify(updated.skills || []),
      updated.registrationUrl,
      updated.maxParticipants || null,
      updated.bannerImage || null,
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
      'UPDATE_EVENT',
      'event',
      id,
      `Modified event ${id}: "${updated.title}"`,
      'success'
    ]);

    const evt = await this.getEventById(id);
    return evt!;
  },
};
