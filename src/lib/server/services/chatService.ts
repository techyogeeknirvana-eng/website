import { db } from '../db/client';
import { CommunityChannel, CommunityMessage, User, UserRole } from '@/types';
import { creditService } from './creditService';
import crypto from 'crypto';

export const chatService = {
  async getChannels(): Promise<CommunityChannel[]> {
    const rows = await db.queryAll('SELECT * FROM community_channels ORDER BY category ASC, name ASC');
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

  async getMessages(channelSlug: string, limit = 50, beforeTimestamp?: string): Promise<CommunityMessage[]> {
    const conditions = ['m.channel_slug = ?', 'm.deleted_at IS NULL'];
    const params: any[] = [channelSlug];

    if (beforeTimestamp) {
      conditions.push('m.created_at < ?');
      params.push(beforeTimestamp);
    }

    const rows = await db.queryAll(`
      SELECT 
        m.*, 
        COALESCE(u.name, 'Community Member') as user_name, 
        COALESCE(u.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80') as user_avatar, 
        COALESCE(u.role, 'USER') as user_role
      FROM community_messages m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY m.created_at DESC
      LIMIT ?
    `, [...params, limit]);

    // Fetch reactions for each message
    const messageIds = rows.map(r => r.id);
    const reactionsMap: Record<string, Record<string, string[]>> = {};

    if (messageIds.length > 0) {
      const placeholders = messageIds.map(() => '?').join(',');
      const rxRows = await db.queryAll<{ message_id: string; emoji: string; user_id: string }>(`
        SELECT message_id, emoji, user_id FROM message_reactions WHERE message_id IN (${placeholders})
      `, messageIds);

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

  async postMessage(
    channelSlug: string,
    content: string,
    user: User,
    codeSnippet?: { language: string; code: string },
    replyToId?: string,
    customId?: string
  ): Promise<CommunityMessage> {
    // Ensure user row exists in DB to prevent foreign key errors
    try {
      const { userService } = await import('./userService');
      await userService.ensureUserInDb(user);
    } catch (_) {}

    // Deduct 1 credit for regular users (admins post free, soft fallback for newly created wallets)
    if (user.role !== 'ADMIN') {
      try {
        const deductRes = await creditService.deductCredits(user.id, 1, `Message in #${channelSlug}`, 'chat');
        if (!deductRes.success && deductRes.error === 'Insufficient credit balance.') {
          throw new Error('Insufficient credits. You need 1 credit to post a message in the community.');
        }
      } catch (err: any) {
        if (err.message?.includes('Insufficient credits')) {
          throw err;
        }
        console.warn('Credit deduction non-critical warning:', err);
      }
    }

    const id = customId || ('msg_' + crypto.randomUUID().slice(0, 10));
    const now = new Date().toISOString();

    await db.execute(`
      INSERT INTO community_messages (
        id, channel_slug, user_id, content, code_language, code_snippet, reply_to_id, is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ]);

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

  async toggleReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    const existing = await db.queryOne('SELECT * FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?', [messageId, userId, emoji]);

    if (existing) {
      await db.execute('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?', [messageId, userId, emoji]);
      return false;
    } else {
      await db.execute('INSERT INTO message_reactions (message_id, user_id, emoji, created_at) VALUES (?, ?, ?, ?)', [messageId, userId, emoji, new Date().toISOString()]);
      return true;
    }
  },

  async pinMessage(messageId: string, isPinned: boolean, adminUser: User): Promise<void> {
    await db.execute('UPDATE community_messages SET is_pinned = ?, updated_at = ? WHERE id = ?', [isPinned ? 1 : 0, new Date().toISOString(), messageId]);
  },

  async deleteMessage(messageId: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await db.execute('UPDATE community_messages SET deleted_at = ?, updated_at = ? WHERE id = ?', [now, now, messageId]);
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
        'DELETE_MESSAGE',
        'community_message',
        messageId,
        `Deleted message ${messageId}`,
        'warning'
      ]);
      return true;
    }
    return false;
  },

  async updateMessage(messageId: string, newContent: string, adminUser: User): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await db.execute('UPDATE community_messages SET content = ?, updated_at = ? WHERE id = ?', [newContent.trim(), now, messageId]);
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
        'UPDATE_MESSAGE',
        'community_message',
        messageId,
        `Modified message ${messageId}`,
        'success'
      ]);
      return true;
    }
    return false;
  },
};
