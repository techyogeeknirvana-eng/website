import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { adminService } from '@/lib/server/services/adminService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const announcements = adminService.getActiveAnnouncements(authUser?.role || 'USER', authUser?.id);
    return apiSuccess(announcements);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch announcements', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const { action, announcementId, title, message, targetAudience, badge, expiresAt } = body;

    // 1. User Dismiss
    if (action === 'dismiss') {
      if (!announcementId) return apiError('announcementId required', 400);
      adminService.dismissAnnouncement(authUser.id, announcementId);
      return apiSuccess({ dismissed: true });
    }

    // 2. Admin Create Broadcast
    if (authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin authorization required.', 403);
    }

    if (!title || !message) {
      return apiError('title and message are required', 400);
    }

    const created = adminService.createAnnouncement(
      title,
      message,
      targetAudience || 'ALL',
      authUser,
      badge,
      expiresAt
    );

    return apiSuccess(created, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to process announcement', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin authorization required.', 403);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return apiError('Announcement id required', 400);

    adminService.deleteAnnouncement(id, authUser);
    return apiSuccess({ deleted: true });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete announcement', 400);
  }
}
