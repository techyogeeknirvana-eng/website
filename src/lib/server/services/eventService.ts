import { db } from '../db/client';
import { CommunityEvent, EventCategory, SubmissionStatus, User, UserRole, EventRegistration, RegistrationStatus } from '@/types';
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
  status?: SubmissionStatus | 'all';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  isAdmin?: boolean;
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
      registrationUrl: row.registration_url || row.event_website_url || '',
      eventWebsiteUrl: row.event_website_url || undefined,
      posterUrl: row.poster_url || row.banner_image || undefined,
      participantsCount: registrations.length + (row.max_participants ? Math.min(row.max_participants, 15) : 10),
      maxParticipants: row.max_participants || undefined,
      bannerImage: row.poster_url || row.banner_image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      rules: row.rules || undefined,
      schedule: row.schedule || undefined,
      prizes: row.prizes || undefined,
      teamSize: row.team_size || undefined,
      fees: row.fees || undefined,
      contactEmail: row.contact_email || undefined,
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

    if (filter.status && filter.status !== 'all') {
      conditions.push('e.status = ?');
      params.push(filter.status);
    } else if (filter.isAdmin) {
      // Admins see all non-deleted events across all statuses
    } else if (filter.userId) {
      // Authenticated users: public sees 'approved' & 'published', but creator sees their own pending/draft/changes_requested/rejected
      conditions.push("(e.status IN ('approved', 'published') OR e.posted_by_user_id = ?)");
      params.push(filter.userId);
    } else {
      // Public / Guest: ONLY approved or published events
      conditions.push("e.status IN ('approved', 'published')");
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
      SELECT e.*, 
        COALESCE(u.id, e.posted_by_user_id) as poster_id, 
        COALESCE(u.name, 'Community Member') as poster_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as poster_avatar, 
        COALESCE(u.role, 'USER') as poster_role
      FROM community_events e
      LEFT JOIN users u ON e.posted_by_user_id = u.id
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
    
    // User-submitted events are NEVER automatically published:
    // They start in 'pending' awaiting admin review (unless created by an Admin who explicitly requested 'approved')
    const isAdmin = user.role === 'ADMIN' || user.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com';
    const status: SubmissionStatus = (isAdmin && data.status === 'approved') 
      ? 'approved' 
      : (data.status === 'draft' ? 'draft' : 'pending');

    await db.execute(`
      INSERT INTO community_events (
        id, title, category, organizer, organizer_logo, date, time, location,
        is_online, registration_deadline, description, eligibility, skills,
        registration_url, event_website_url, poster_url, max_participants, banner_image,
        rules, schedule, prizes, team_size, fees, contact_email,
        posted_by_user_id, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.registrationUrl || data.eventWebsiteUrl || '',
      data.eventWebsiteUrl || null,
      data.posterUrl || data.bannerImage || null,
      data.maxParticipants || null,
      data.bannerImage || data.posterUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      data.rules || null,
      data.schedule || null,
      data.prizes || null,
      data.teamSize || 'Individual / Teams up to 4',
      data.fees || 'Free',
      data.contactEmail || user.email || null,
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
      SELECT e.*, 
        COALESCE(u.id, e.posted_by_user_id) as poster_id, 
        COALESCE(u.name, 'Community Member') as poster_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as poster_avatar, 
        COALESCE(u.role, 'USER') as poster_role
      FROM community_events e
      LEFT JOIN users u ON e.posted_by_user_id = u.id
      WHERE e.id = ? AND e.deleted_at IS NULL
    `, [id]);

    return row ? await this.mapRow(row) : null;
  },

  async reviewEvent(id: string, newStatus: SubmissionStatus, adminUser: User, rejectionReason?: string): Promise<CommunityEvent> {
    const now = new Date().toISOString();

    await db.execute(`
      UPDATE community_events SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?
    `, [newStatus, rejectionReason || null, now, id]);

    let action = 'REVIEW_EVENT';
    if (newStatus === 'approved') action = 'APPROVE_EVENT';
    else if (newStatus === 'rejected') action = 'REJECT_EVENT';
    else if (newStatus === 'changes_requested') action = 'REQUEST_CHANGES_EVENT';
    else if (newStatus === 'cancelled') action = 'CANCEL_EVENT';
    else if (newStatus === 'archived') action = 'ARCHIVE_EVENT';

    try {
      await db.execute(`
        INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'log_' + crypto.randomUUID(),
        now,
        adminUser.id,
        adminUser.name,
        adminUser.role,
        action,
        'event',
        id,
        `${action}: Status changed to "${newStatus}"${rejectionReason ? ` | Notes: ${rejectionReason}` : ''}`,
        newStatus === 'rejected' ? 'warning' : 'success'
      ]);
    } catch (_) {}

    const evt = await this.getEventById(id);
    return evt!;
  },

  async listEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const rows = await db.queryAll<any>(`
      SELECT er.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ?
      ORDER BY er.created_at DESC
    `, [eventId]);

    return rows.map((r: any) => ({
      userId: r.user_id,
      eventId: r.event_id,
      userName: r.user_name || 'Community Member',
      userEmail: r.user_email || '',
      userAvatar: r.user_avatar || undefined,
      status: (r.status || 'REGISTERED') as RegistrationStatus,
      teamName: r.team_name || undefined,
      createdAt: r.created_at,
      attendedAt: r.attended_at || undefined,
    }));
  },

  async updateRegistrationStatus(eventId: string, userId: string, status: RegistrationStatus): Promise<boolean> {
    const now = new Date().toISOString();
    const attendedAt = status === 'ATTENDED' ? now : null;
    await db.execute(`
      UPDATE event_registrations SET status = ?, attended_at = ? WHERE event_id = ? AND user_id = ?
    `, [status, attendedAt, eventId, userId]);
    return true;
  },

  async toggleRSVP(eventId: string, userId: string, details?: { teamName?: string }): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);

    if (existing) {
      await db.execute('DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);
      return false;
    } else {
      const now = new Date().toISOString();
      await db.execute(`
        INSERT INTO event_registrations (user_id, event_id, status, team_name, created_at)
        VALUES (?, ?, 'REGISTERED', ?, ?)
      `, [userId, eventId, details?.teamName || null, now]);
      return true;
    }
  },

  async deleteEvent(id: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const target = await this.getEventById(id);
    await db.execute("UPDATE community_events SET deleted_at = ?, status = 'rejected', updated_at = ? WHERE id = ?", [now, now, id]);
    await db.execute('DELETE FROM community_events WHERE id = ?', [id]);
    await db.execute('DELETE FROM event_registrations WHERE event_id = ?', [id]);

    try {
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
    } catch (_) {}
    return true;
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
        event_website_url = ?,
        poster_url = ?,
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
      updated.registrationUrl || updated.eventWebsiteUrl || '',
      updated.eventWebsiteUrl || null,
      updated.posterUrl || updated.bannerImage || null,
      updated.maxParticipants || null,
      updated.bannerImage || updated.posterUrl || null,
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

  async checkDuplicateRegistrationUrl(url: string, excludeId?: string): Promise<{ isDuplicate: boolean; matchedEvent?: { id: string; title: string } }> {
    if (!url || !url.trim()) return { isDuplicate: false };
    const cleanUrl = url.trim().toLowerCase().replace(/\/+$/, '');
    const rows = await db.queryAll<{ id: string; title: string; registration_url: string; event_website_url: string }>(`
      SELECT id, title, registration_url, event_website_url FROM community_events
      WHERE deleted_at IS NULL
    `);
    const found = rows.find(r => {
      if (excludeId && r.id === excludeId) return false;
      const reg = (r.registration_url || '').trim().toLowerCase().replace(/\/+$/, '');
      const web = (r.event_website_url || '').trim().toLowerCase().replace(/\/+$/, '');
      return (reg && reg === cleanUrl) || (web && web === cleanUrl);
    });
    return {
      isDuplicate: Boolean(found),
      matchedEvent: found ? { id: found.id, title: found.title } : undefined,
    };
  },
};
