import { getDatabase } from '../db/client';
import { AuditLog, ContentReport, SystemAnnouncement, User, UserRole } from '@/types';
import crypto from 'crypto';

export const adminService = {
  getAuditLogs(limit = 100, offset = 0): AuditLog[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ? OFFSET ?').all(limit, offset) as any[];
    return rows.map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      actorId: r.actor_id,
      actorName: r.actor_name,
      actorRole: r.actor_role as UserRole,
      action: r.action,
      targetType: r.target_type as any,
      targetId: r.target_id,
      details: r.details,
      status: r.status as any,
      ipAddress: r.ip_address || undefined,
    }));
  },

  logAction(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: string,
    targetType: string,
    targetId: string,
    details: string,
    status: 'success' | 'warning' | 'error' = 'success',
    ipAddress?: string
  ): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'log_' + crypto.randomUUID(),
      new Date().toISOString(),
      actorId,
      actorName,
      actorRole,
      action,
      targetType,
      targetId,
      details,
      status,
      ipAddress || null
    );
  },

  getReports(status?: string): ContentReport[] {
    const db = getDatabase();
    let query = `
      SELECT r.*, u.name as reporter_name
      FROM content_reports r
      JOIN users u ON r.reported_by_user_id = u.id
    `;
    const params: any[] = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    query += ' ORDER BY r.created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      reportedBy: r.reported_by_user_id,
      reportedByName: r.reporter_name,
      targetType: r.target_type as any,
      targetId: r.target_id,
      targetTitle: r.target_title || 'Reported item',
      reason: r.reason,
      details: r.details || '',
      status: r.status as any,
      createdAt: r.created_at,
    }));
  },

  resolveReport(reportId: string, status: 'resolved' | 'dismissed', note: string, adminUser: User): void {
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE content_reports SET status = ?, resolution_note = ?, resolved_by_user_id = ?, updated_at = ?
      WHERE id = ?
    `).run(status, note, adminUser.id, now, reportId);

    this.logAction(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'RESOLVE_REPORT',
      'report',
      reportId,
      `Report ${reportId} marked as ${status}. Note: ${note}`,
      'success'
    );
  },

  getAnnouncements(): SystemAnnouncement[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM system_announcements ORDER BY created_at DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      message: r.message,
      targetAudience: r.target_audience as any,
      badge: r.badge,
      createdBy: r.created_by_name,
      active: Boolean(r.active),
      expiresAt: r.expires_at || undefined,
      createdAt: r.created_at,
    }));
  },

  getActiveAnnouncements(userRole: UserRole = 'USER', userId?: string): SystemAnnouncement[] {
    const db = getDatabase();
    const now = new Date().toISOString();
    let query = `
      SELECT * FROM system_announcements
      WHERE active = 1 AND (expires_at IS NULL OR expires_at > ?)
    `;
    const params: any[] = [now];

    if (userRole === 'USER') {
      query += ` AND target_audience IN ('ALL', 'USERS')`;
    }

    if (userId) {
      query += ` AND id NOT IN (SELECT announcement_id FROM dismissed_announcements WHERE user_id = ?)`;
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC';
    const rows = db.prepare(query).all(...params) as any[];

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      message: r.message,
      targetAudience: r.target_audience as any,
      badge: r.badge,
      createdBy: r.created_by_name,
      active: true,
      expiresAt: r.expires_at || undefined,
      createdAt: r.created_at,
    }));
  },

  createAnnouncement(
    title: string,
    message: string,
    targetAudience: 'ALL' | 'USERS' | 'ADMINS',
    adminUser: User,
    badge = 'PLATFORM UPDATE',
    expiresAt?: string
  ): SystemAnnouncement {
    const db = getDatabase();
    const id = 'ann_' + crypto.randomUUID().slice(0, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO system_announcements (
        id, title, message, target_audience, badge, created_by_name, created_by_user_id, active, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      message.trim(),
      targetAudience,
      badge.trim(),
      adminUser.name,
      adminUser.id,
      1,
      expiresAt || null,
      now
    );

    this.logAction(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'CREATE_ANNOUNCEMENT',
      'system',
      id,
      `Broadcast announcement "${title}" created for ${targetAudience}`,
      'success'
    );

    return {
      id,
      title: title.trim(),
      message: message.trim(),
      targetAudience,
      badge,
      createdBy: adminUser.name,
      active: true,
      expiresAt,
      createdAt: now,
    };
  },

  deleteAnnouncement(id: string, adminUser: User): boolean {
    const db = getDatabase();
    db.prepare('DELETE FROM system_announcements WHERE id = ?').run(id);

    this.logAction(
      adminUser.id,
      adminUser.name,
      adminUser.role,
      'DELETE_ANNOUNCEMENT',
      'system',
      id,
      `Deleted announcement ${id}`,
      'warning'
    );

    return true;
  },

  dismissAnnouncement(userId: string, announcementId: string): void {
    const db = getDatabase();
    db.prepare(`
      INSERT OR IGNORE INTO dismissed_announcements (user_id, announcement_id, created_at)
      VALUES (?, ?, ?)
    `).run(userId, announcementId, new Date().toISOString());
  },
};
