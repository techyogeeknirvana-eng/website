import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { momentService } from '@/lib/server/services/momentService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const includePending = searchParams.get('includePending') === 'true' && authUser?.role === 'ADMIN';

    const moments = await momentService.listMoments(limit, offset, includePending, authUser?.id);
    return apiSuccess(moments);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch moments', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const { action, content, category, imageUrl, momentId } = body;

    if (action === 'like') {
      if (!momentId) return apiError('momentId required', 400);
      const isLiked = await momentService.toggleLike(momentId, authUser.id);
      return apiSuccess({ isLiked });
    }

    if (action === 'comment') {
      if (!momentId || !content) return apiError('momentId and content required', 400);
      const comment = await momentService.addComment(momentId, content, authUser);
      return apiSuccess(comment, 201);
    }

    if (!content || !category) {
      return apiError('content and category are required', 400);
    }

    const moment = await momentService.createMoment(content, category, imageUrl, authUser, body.id);
    return apiSuccess(moment, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to process moment', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin privileges required.', 403);
    }

    const body = await req.json();
    const { id, status, rejectionReason, updates, action } = body;

    if (!id) {
      return apiError('id is required', 400);
    }

    // 1. Modify full moment details
    if (action === 'modify' || updates) {
      const updated = await momentService.updateMoment(id, updates || body, authUser);
      return apiSuccess(updated);
    }

    // 2. Review status
    if (!status) {
      return apiError('status or updates required', 400);
    }

    const success = await momentService.reviewMoment(id, status, rejectionReason, authUser);
    return apiSuccess({ success });
  } catch (err: any) {
    return apiError(err.message || 'Failed to update moment', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin privileges required.', 403);
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch (_) {}
    }

    if (!id) {
      return apiError('Moment id required', 400);
    }

    const deleted = await momentService.deleteMoment(id, authUser);
    if (!deleted) {
      return apiError('Moment not found or already deleted', 404);
    }

    return apiSuccess({ success: true, message: 'Moment deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete moment', 400);
  }
}
