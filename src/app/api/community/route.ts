import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { chatService } from '@/lib/server/services/chatService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelSlug = searchParams.get('channel');

    if (!channelSlug) {
      // Return channels list
      const channels = await chatService.getChannels();
      return apiSuccess({ channels });
    }

    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const beforeTimestamp = searchParams.get('before') || undefined;

    const messages = await chatService.getMessages(channelSlug, limit, beforeTimestamp);
    return apiSuccess({ channelSlug, messages });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch community data', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let authUser = await extractAuthUser(req);
    if (!authUser) {
      const uid = body.userId || body.senderId;
      if (uid) {
        const { userService } = await import('@/lib/server/services/userService');
        const email = body.userEmail || `${uid}@tygn.dev`;
        const name = body.userName || 'Community Member';
        await userService.ensureUserInDb({ id: uid, email, name, role: 'USER' });
        authUser = await userService.getUserById(uid);
      }
    }
    if (!authUser) {
      return apiError('Unauthorized. Please log in.', 401);
    }

    const { action, channelSlug, content, codeSnippet, replyToId, messageId, emoji } = body;

    // 1. Reaction toggle
    if (action === 'reaction' || action === 'react') {
      if (!messageId || !emoji) {
        return apiError('messageId and emoji are required.', 400);
      }
      const isAdded = await chatService.toggleReaction(messageId, authUser.id, emoji);
      return apiSuccess({ isAdded });
    }

    // 2. Post new message (1 credit deduction enforced inside chatService)
    if (!channelSlug || !content || !content.trim()) {
      return apiError('channelSlug and content are required.', 400);
    }

    const message = await chatService.postMessage(channelSlug, content, authUser, codeSnippet, replyToId, body.id);
    return apiSuccess(message, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to post message', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized. Please log in.', 401);
    }

    const body = await req.json();
    const { action, messageId, content, isPinned } = body;

    if (!messageId) {
      return apiError('messageId is required.', 400);
    }

    if (action === 'pin') {
      if (authUser.role !== 'ADMIN') {
        return apiError('Forbidden. Admin access required to pin messages.', 403);
      }
      await chatService.pinMessage(messageId, Boolean(isPinned), authUser);
      return apiSuccess({ success: true, isPinned: Boolean(isPinned) });
    }

    // Edit message content
    if (!content || !content.trim()) {
      return apiError('content is required.', 400);
    }

    // Admins can edit any message; regular users could edit their own if needed
    const updated = await chatService.updateMessage(messageId, content, authUser);
    if (!updated) {
      return apiError('Message not found or update failed.', 404);
    }

    return apiSuccess({ success: true, message: 'Message updated successfully', content });
  } catch (err: any) {
    return apiError(err.message || 'Failed to update message', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized. Please log in.', 401);
    }

    const { searchParams } = new URL(req.url);
    let messageId = searchParams.get('messageId');

    if (!messageId) {
      try {
        const body = await req.json();
        messageId = body.messageId;
      } catch (_) {}
    }

    if (!messageId) {
      return apiError('messageId is required.', 400);
    }

    const deleted = await chatService.deleteMessage(messageId, authUser);
    if (!deleted) {
      return apiError('Message not found or already deleted.', 404);
    }

    return apiSuccess({ success: true, message: 'Message deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete message', 400);
  }
}
