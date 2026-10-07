import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { eventService } from '@/lib/server/services/eventService';
import { apiSuccess, apiError, apiPaginated } from '@/lib/server/utils/response';

import { isGlobalAdminEmail } from '@/lib/server/middleware/authGuard';

export async function GET(req: NextRequest) {
  try {
    let authUser = await extractAuthUser(req);
    const userEmailHeader = req.headers.get('x-user-email');
    const userIdHeader = req.headers.get('x-user-id');
    if (!authUser && userEmailHeader) {
      try {
        const { userService } = await import('@/lib/server/services/userService');
        authUser = await userService.getUserByEmail(userEmailHeader);
      } catch (_) {}
    }
    const isAdmin = Boolean(
      (authUser && (authUser.role === 'ADMIN' || isGlobalAdminEmail(authUser.email))) ||
      (userEmailHeader && isGlobalAdminEmail(userEmailHeader))
    );
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Participant management for organizer & admin
    if (action === 'registrations') {
      const eventId = searchParams.get('eventId');
      if (!eventId) return apiError('eventId required', 400);
      const targetEvent = await eventService.getEventById(eventId);
      if (!targetEvent) return apiError('Event not found', 404);
      if (!isAdmin && targetEvent.postedBy.id !== authUser?.id && targetEvent.postedBy.id !== userIdHeader) {
        return apiError('Forbidden. Only event organizer or admin can view registration list.', 403);
      }
      const registrations = await eventService.listEventRegistrations(eventId);
      return apiSuccess(registrations);
    }

    const status = searchParams.get('status') as any;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const userId = searchParams.get('userId') || userIdHeader || authUser?.id || undefined;

    const { items, total } = await eventService.listEvents({
      status,
      category,
      search,
      page,
      limit,
      userId,
      isAdmin,
    });

    const totalPages = Math.ceil(total / limit);
    const deletedIds = await eventService.getDeletedEventIds();

    return apiPaginated(items, {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    }, 200, { deletedIds });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch events', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let authUser = await extractAuthUser(req);
    const userEmailHeader = req.headers.get('x-user-email');
    const userIdHeader = req.headers.get('x-user-id');

    if (!authUser && (userEmailHeader || userIdHeader)) {
      try {
        const { userService } = await import('@/lib/server/services/userService');
        if (userEmailHeader) {
          authUser = await userService.getUserByEmail(userEmailHeader);
        }
        if (!authUser && userIdHeader) {
          authUser = await userService.getUserById(userIdHeader);
        }
      } catch (_) {}
    }

    if (!authUser) {
      const uid = body.postedByUserId || body.userId || body.authorId || body.postedBy?.id || userIdHeader;
      const email = body.userEmail || body.postedBy?.email || userEmailHeader || (uid ? `${uid}@tygn.dev` : null);
      if (uid || email) {
        const { userService } = await import('@/lib/server/services/userService');
        const finalUid = uid || `user_${Date.now()}`;
        const finalEmail = (email || `${finalUid}@tygn.dev`).toLowerCase().trim();
        const name = body.organizer || body.userName || body.postedBy?.name || 'Community Member';
        const role = (body.postedBy?.role === 'ADMIN' || isGlobalAdminEmail(finalEmail) || finalUid === 'user_lead_admin') ? 'ADMIN' : 'USER';
        await userService.ensureUserInDb({ id: finalUid, email: finalEmail, name, role });
        authUser = await userService.getUserById(finalUid);
      }
    }

    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const { action, eventId } = body;

    if (action === 'rsvp') {
      if (!eventId) return apiError('eventId required', 400);
      const isRegistered = await eventService.toggleRSVP(eventId, authUser.id, { teamName: body.teamName });
      return apiSuccess({ isRegistered });
    }

    if (action === 'update_registration') {
      const { targetUserId, status } = body;
      if (!eventId || !targetUserId || !status) return apiError('eventId, targetUserId, and status required', 400);
      const targetEvent = await eventService.getEventById(eventId);
      const isAdmin = authUser.role === 'ADMIN' || isGlobalAdminEmail(authUser.email);
      if (!isAdmin && targetEvent?.postedBy.id !== authUser.id) {
        return apiError('Forbidden. Only event organizer or admin can update registration status.', 403);
      }
      await eventService.updateRegistrationStatus(eventId, targetUserId, status);
      return apiSuccess({ success: true, status });
    }

    const created = await eventService.createEvent(body, authUser);
    return apiSuccess(created, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to create event', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let authUser = await extractAuthUser(req);
    const emailHeader = req.headers.get('x-user-email');
    if (!authUser && emailHeader && isGlobalAdminEmail(emailHeader)) {
      const { userService } = await import('@/lib/server/services/userService');
      authUser = await userService.getUserByEmail(emailHeader);
    }
    const isAdmin = authUser && (authUser.role === 'ADMIN' || isGlobalAdminEmail(authUser.email));
    if (!isAdmin) {
      return apiError('Forbidden. Admin authorization required.', 403);
    }

    const body = await req.json();
    const { id, status, rejectionReason, updates, action } = body;

    if (!id) {
      return apiError('id required', 400);
    }

    // 1. Modify full event details
    if (action === 'modify' || updates) {
      const updated = await eventService.updateEvent(id, updates || body, authUser!);
      return apiSuccess(updated);
    }

    // 2. Review status update
    if (!status) {
      return apiError('status or updates required', 400);
    }

    const updated = await eventService.reviewEvent(id, status, authUser!, rejectionReason);
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError(err.message || 'Failed to update event', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let authUser = await extractAuthUser(req);
    const emailHeader = req.headers.get('x-user-email');
    const idHeader = req.headers.get('x-user-id');
    if (!authUser && emailHeader) {
      try {
        const { userService } = await import('@/lib/server/services/userService');
        authUser = await userService.getUserByEmail(emailHeader);
      } catch (_) {}
    }
    const isAdmin = Boolean(
      (authUser && (authUser.role === 'ADMIN' || isGlobalAdminEmail(authUser.email))) ||
      (emailHeader && isGlobalAdminEmail(emailHeader)) ||
      idHeader === 'user_lead_admin'
    );
    if (!isAdmin) {
      return apiError('Forbidden. Admin authorization required.', 403);
    }

    if (!authUser) {
      authUser = {
        id: idHeader || 'user_lead_admin',
        name: 'TechYOGeek Nirvana',
        email: emailHeader || 'techyogeeknirvana@gmail.com',
        role: 'ADMIN',
      } as any;
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

    await eventService.deleteEvent(id, authUser!);
    return apiSuccess({ success: true, message: 'Event deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete event', 400);
  }
}
