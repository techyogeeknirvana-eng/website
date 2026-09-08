import { getDatabase } from '../db/client';
import { CommunityEvent, EventCategory, SubmissionStatus, User, UserRole } from '@/types';
import crypto from 'crypto';

export interface EventFilter {
  status?: SubmissionStatus;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  mapRow(row: any): CommunityEvent {
    const db = getDatabase();
    const registrations = db.prepare('SELECT user_id FROM event_registrations WHERE event_id = ?').all(row.id) as { user_id: string }[];

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
      skills: JSON.parse(row.skills || '[]'),
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

  listEvents(filter: EventFilter = {}): { items: CommunityEvent[]; total: number } {
    const db = getDatabase();
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

    const countRow = db.prepare(`
      SELECT COUNT(*) as count FROM community_events e WHERE ${whereClause}
    `).get(...params) as { count: number };

    const rows = db.prepare(`
      SELECT e.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM community_events e
      JOIN users u ON e.posted_by_user_id = u.id
      WHERE ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    return {
      items: rows.map(r => this.mapRow(r)),
      total: countRow.count,
    };
  },

  createEvent(data: Partial<CommunityEvent>, user: User): CommunityEvent {
    const db = getDatabase();
    const id = data.id || ('event_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();
    const status: SubmissionStatus = 'pending';

    db.prepare(`
      INSERT INTO community_events (
        id, title, category, organizer, organizer_logo, date, time, location,
        is_online, registration_deadline, description, eligibility, skills,
        registration_url, max_participants, banner_image, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    return this.getEventById(id)!;
  },

  getEventById(id: string): CommunityEvent | null {
    const db = getDatabase();
    const row = db.prepare(`
      SELECT e.*, u.id as poster_id, u.name as poster_name, u.avatar as poster_avatar, u.role as poster_role
      FROM community_events e
      JOIN users u ON e.posted_by_user_id = u.id
      WHERE e.id = ? AND e.deleted_at IS NULL
    `).get(id);

    return row ? this.mapRow(row) : null;
  },

  reviewEvent(id: string, newStatus: SubmissionStatus, adminUser: User, rejectionReason?: string): CommunityEvent {
    const db = getDatabase();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE community_events SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?
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
      newStatus === 'approved' ? 'APPROVE_EVENT' : 'REJECT_EVENT',
      'event',
      id,
      `Reviewed community event. Set status to ${newStatus}`,
      'success'
    );

    return this.getEventById(id)!;
  },

  toggleRSVP(eventId: string, userId: string): boolean {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?').get(userId, eventId);

    if (existing) {
      db.prepare('DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?').run(userId, eventId);
      return false;
    } else {
      db.prepare('INSERT INTO event_registrations (user_id, event_id, created_at) VALUES (?, ?, ?)').run(userId, eventId, new Date().toISOString());
      return true;
    }
  },

  deleteEvent(id: string, adminUser: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const target = this.getEventById(id);
    const result = db.prepare('UPDATE community_events SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now, now, id);
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
        'DELETE_EVENT',
        'event',
        id,
        `Deleted event "${target?.title || id}" by "${target?.organizer || 'N/A'}"`,
        'warning'
      );
      return true;
    }
    return false;
  },

  updateEvent(id: string, updates: Partial<CommunityEvent>, adminUser: User): CommunityEvent {
    const db = getDatabase();
    const current = this.getEventById(id);
    if (!current) throw new Error('Event not found.');

    const now = new Date().toISOString();
    const updated: CommunityEvent = { ...current, ...updates };

    db.prepare(`
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
    `).run(
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
      'UPDATE_EVENT',
      'event',
      id,
      `Modified event ${id}: "${updated.title}"`,
      'success'
    );

    return this.getEventById(id)!;
  },
};
