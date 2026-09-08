import { getDatabase } from '../db/client';
import { CommunityChannel, CommunityMessage, User, UserRole } from '@/types';
import { creditService } from './creditService';
import crypto from 'crypto';

export const chatService = {
  getChannels(): CommunityChannel[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM community_channels ORDER BY category ASC, name ASC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description || '',
      category: r.category,
      iconName: r.icon_name || 'MessageSquare',
      isLocked: Boolean(r.is_locked),
      isAnnouncement: Boolean(r.is_announcement),
    }));
  },

  getMessages(channelSlug: string, limit = 50, beforeTimestamp?: string): CommunityMessage[] {
    const db = getDatabase();
    const conditions = ['m.channel_slug = ?', 'm.deleted_at IS NULL'];
    const params: any[] = [channelSlug];

    if (beforeTimestamp) {
      conditions.push('m.created_at < ?');
      params.push(beforeTimestamp);
    }

    const rows = db.prepare(`
      SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.role as user_role
      FROM community_messages m
      JOIN users u ON m.user_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY m.created_at DESC
      LIMIT ?
    `).all(...params, limit) as any[];

    // Fetch reactions for each message
    const messageIds = rows.map(r => r.id);
    const reactionsMap: Record<string, Record<string, string[]>> = {};

    if (messageIds.length > 0) {
      const placeholders = messageIds.map(() => '?').join(',');
      const rxRows = db.prepare(`
        SELECT message_id, emoji, user_id FROM message_reactions WHERE message_id IN (${placeholders})
      `).all(...messageIds) as { message_id: string; emoji: string; user_id: string }[];

      for (const rx of rxRows) {
        if (!reactionsMap[rx.message_id]) reactionsMap[rx.message_id] = {};
        if (!reactionsMap[rx.message_id][rx.emoji]) reactionsMap[rx.message_id][rx.emoji] = [];
        reactionsMap[rx.message_id][rx.emoji].push(rx.user_id);
      }
    }

    return rows.reverse().map(r => ({
      id: r.id,
      channelSlug: r.channel_slug,
      userId: r.user_id,
      userName: r.user_name,
      userAvatar: r.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      userRole: r.user_role as UserRole,
      content: r.content,
      codeSnippet: r.code_snippet ? { language: r.code_language || 'text', code: r.code_snippet } : undefined,
      timestamp: r.created_at,
      reactions: reactionsMap[r.id] || {},
      replyToId: r.reply_to_id || undefined,
      isPinned: Boolean(r.is_pinned),
    }));
  },

  postMessage(
    channelSlug: string,
    content: string,
    user: User,
    codeSnippet?: { language: string; code: string },
    replyToId?: string
  ): CommunityMessage {
    const db = getDatabase();

    // Enforce 1 credit cost per message
    const deductRes = creditService.deductCredits(user.id, 1, `Message in #${channelSlug}`, 'chat');
    if (!deductRes.success) {
      throw new Error('Insufficient credits. You need 1 credit to post a message in the community.');
    }

    const id = 'msg_' + crypto.randomUUID().slice(0, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO community_messages (
        id, channel_slug, user_id, content, code_language, code_snippet, reply_to_id, is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      channelSlug,
      user.id,
      content.trim(),
      codeSnippet?.language || null,
      codeSnippet?.code || null,
      replyToId || null,
      0,
      now,
      now
    );

    return {
      id,
      channelSlug,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role,
      content: content.trim(),
      codeSnippet,
      timestamp: now,
      reactions: {},
      replyToId,
      isPinned: false,
    };
  },

  toggleReaction(messageId: string, userId: string, emoji: string): boolean {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?').get(messageId, userId, emoji);

    if (existing) {
      db.prepare('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?').run(messageId, userId, emoji);
      return false;
    } else {
      db.prepare('INSERT INTO message_reactions (message_id, user_id, emoji, created_at) VALUES (?, ?, ?, ?)').run(messageId, userId, emoji, new Date().toISOString());
      return true;
    }
  },

  pinMessage(messageId: string, isPinned: boolean, adminUser: User): void {
    const db = getDatabase();
    db.prepare('UPDATE community_messages SET is_pinned = ?, updated_at = ? WHERE id = ?').run(isPinned ? 1 : 0, new Date().toISOString(), messageId);
  },

  deleteMessage(messageId: string, adminUser: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const result = db.prepare('UPDATE community_messages SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now, now, messageId);
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
        'DELETE_MESSAGE',
        'community_message',
        messageId,
        `Deleted message ${messageId}`,
        'warning'
      );
      return true;
    }
    return false;
  },

  updateMessage(messageId: string, newContent: string, adminUser: User): boolean {
    const db = getDatabase();
    const now = new Date().toISOString();
    const result = db.prepare('UPDATE community_messages SET content = ?, updated_at = ? WHERE id = ?').run(newContent.trim(), now, messageId);
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
        'UPDATE_MESSAGE',
        'community_message',
        messageId,
        `Modified message ${messageId}`,
        'success'
      );
      return true;
    }
    return false;
  },
};
