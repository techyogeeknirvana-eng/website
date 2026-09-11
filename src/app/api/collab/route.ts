import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { collabService } from '@/lib/server/services/collabService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { ensureDbReady } from '@/lib/server/db/client';

export async function GET(req: NextRequest) {
  try {
    await ensureDbReady();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const requests = await collabService.listCollabRequests(status, limit);
    return apiSuccess(requests);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch collaboration requests', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbReady();
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized. Please log in to interact with Collab Finder.', 401);
    }

    const body = await req.json();
    const { action, id } = body;

    // 1. Apply to a collaboration request
    if (action === 'apply') {
      if (!id) {
        return apiError('Collaboration request ID is required to apply.', 400);
      }
      const result = await collabService.applyToCollabRequest(id, authUser);
      return apiSuccess(result);
    }

    // 2. Update status (open / filled)
    if (action === 'status') {
      if (!id || !body.status) {
        return apiError('id and status are required.', 400);
      }
      const ok = await collabService.updateCollabStatus(id, body.status, authUser);
      return apiSuccess({ success: ok });
    }

    // 3. Create a new collaboration request
    if (!body.title || !body.roleNeeded || !body.description) {
      return apiError('title, roleNeeded, and description are required fields.', 400);
    }

    const created = await collabService.createCollabRequest(body, authUser);
    return apiSuccess(created, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to process collaboration request', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureDbReady();
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized. Please log in.', 401);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return apiError('id query parameter is required', 400);
    }

    const ok = await collabService.deleteCollabRequest(id, authUser);
    return apiSuccess({ success: ok, message: 'Collaboration request deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete collaboration request', 400);
  }
}
