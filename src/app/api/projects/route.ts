import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { projectService } from '@/lib/server/services/projectService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const includePending = searchParams.get('includePending') === 'true' && authUser?.role === 'ADMIN';

    const projects = await projectService.listProjects(category, limit, offset, includePending, authUser?.id);
    return apiSuccess(projects);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch projects', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let authUser = await extractAuthUser(req);
    if (!authUser) {
      const uid = body.authorId || body.userId;
      if (uid) {
        const { userService } = await import('@/lib/server/services/userService');
        const email = body.authorEmail || `${uid}@tygn.dev`;
        const name = body.authorName || 'Community Member';
        await userService.ensureUserInDb({ id: uid, email, name, role: 'USER' });
        authUser = await userService.getUserById(uid);
      }
    }
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const { action, projectId } = body;

    if (action === 'like') {
      if (!projectId) return apiError('projectId required', 400);
      const isLiked = await projectService.toggleLike(projectId, authUser.id);
      return apiSuccess({ isLiked });
    }

    const project = await projectService.createProject(body, authUser);
    return apiSuccess(project, 201);
  } catch (err: any) {
    return apiError(err.message || 'Failed to create project', 400);
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

    // 1. Modify full project details
    if (action === 'modify' || updates) {
      const updated = await projectService.updateProject(id, updates || body, authUser);
      return apiSuccess(updated);
    }

    // 2. Review approval status
    if (!status) {
      return apiError('status or updates required', 400);
    }

    const success = await projectService.reviewProject(id, status, rejectionReason, authUser);
    return apiSuccess({ success });
  } catch (err: any) {
    return apiError(err.message || 'Failed to update project', 400);
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
      return apiError('Project id required', 400);
    }

    const deleted = await projectService.deleteProject(id, authUser);
    if (!deleted) {
      return apiError('Project not found or already deleted', 404);
    }

    return apiSuccess({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete project', 400);
  }
}
