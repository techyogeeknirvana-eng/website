import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { eventService } from '@/lib/server/services/eventService';
import { apiSuccess, apiError, apiPaginated } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const { items, total } = await eventService.listEvents({
      status,
      category,
      search,
      page,
      limit,
      userId: authUser?.id,
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
    return apiError(err.message || 'Failed to fetch events', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let authUser = await extractAuthUser(req);
    if (!authUser) {
      const uid = body.postedByUserId || body.userId || body.authorId;
      if (uid) {
        const { userService } = await import('@/lib/server/services/userService');
        const email = body.userEmail || `${uid}@tygn.dev`;
        const name = body.organizer || body.userName || 'Community Member';
        await userService.ensureUserInDb({ id: uid, email, name, role: 'USER' });
        authUser = await userService.getUserById(uid);
      }
    }
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const { action, eventId } = body;

    if (action === 'rsvp') {
      if (!eventId) return apiError('eventId required', 400);
      const isRegistered = await eventService.toggleRSVP(eventId, authUser.id);
      return apiSuccess({ isRegistered });
    }

    const created = await eventService.createEvent(body, authUser);
    return apiSuccess(created, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to create event', 400);
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

    // 1. Modify full event details
    if (action === 'modify' || updates) {
      const updated = await eventService.updateEvent(id, updates || body, authUser);
      return apiSuccess(updated);
    }

    // 2. Review status update
    if (!status) {
      return apiError('status or updates required', 400);
    }

    const updated = await eventService.reviewEvent(id, status, authUser, rejectionReason);
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError(err.message || 'Failed to update event', 400);
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
      return apiError('Event id required', 400);
    }

    const deleted = await eventService.deleteEvent(id, authUser);
    if (!deleted) {
      return apiError('Event not found or already deleted', 404);
    }

    return apiSuccess({ success: true, message: 'Event deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete event', 400);
  }
}
