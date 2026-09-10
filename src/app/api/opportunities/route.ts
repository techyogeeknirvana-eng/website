import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { oppService } from '@/lib/server/services/oppService';
import { apiSuccess, apiError, apiPaginated } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;
    const isRemote = searchParams.has('isRemote') ? searchParams.get('isRemote') === 'true' : undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const { items, total } = await oppService.listOpportunities({
      status,
      type,
      search,
      isRemote,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return apiPaginated(items, {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch opportunities', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const { action, opportunityId } = body;

    if (action === 'save') {
      if (!opportunityId) return apiError('opportunityId required', 400);
      const isSaved = await oppService.toggleSave(opportunityId, authUser.id);
      return apiSuccess({ isSaved });
    }

    const created = await oppService.createOpportunity(body, authUser);
    return apiSuccess(created, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to create opportunity', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin authorization required.', 403);
    }

    const body = await req.json();
    const { id, status, rejectionReason, updates, action } = body;

    if (!id) {
      return apiError('id required', 400);
    }

    // 1. Modify full opportunity details
    if (action === 'modify' || updates) {
      const updated = await oppService.updateOpportunity(id, updates || body, authUser);
      return apiSuccess(updated);
    }

    // 2. Review status update
    if (!status) {
      return apiError('status or updates required', 400);
    }

    const updated = await oppService.reviewOpportunity(id, status, authUser, rejectionReason);
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError(err.message || 'Failed to update opportunity', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin authorization required.', 403);
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
      return apiError('Opportunity id required', 400);
    }

    const deleted = await oppService.deleteOpportunity(id, authUser);
    if (!deleted) {
      return apiError('Opportunity not found or already deleted', 404);
    }

    return apiSuccess({ success: true, message: 'Opportunity deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete opportunity', 400);
  }
}
