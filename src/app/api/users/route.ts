import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { userService } from '@/lib/server/services/userService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const users = userService.getAllUsers();
    return apiSuccess(users);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch users', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized. Please log in.', 401);
    }

    const body = await req.json();
    const { targetUserId, updates, action, role, suspend } = body;

    // 1. Role Change (Admin Only)
    if (action === 'change_role') {
      if (authUser.role !== 'ADMIN') {
        return apiError('Forbidden. Admin access required.', 403);
      }
      if (!targetUserId || !role) {
        return apiError('targetUserId and role are required.', 400);
      }
      userService.changeRole(targetUserId, role, authUser);
      return apiSuccess({ success: true, message: `Role changed to ${role}` });
    }

    // 2. Suspend/Restore (Admin Only)
    if (action === 'toggle_suspend' || action === 'suspend_user') {
      if (authUser.role !== 'ADMIN') {
        return apiError('Forbidden. Admin access required.', 403);
      }
      if (!targetUserId) {
        return apiError('targetUserId is required.', 400);
      }
      const explicitStatus = suspend !== undefined ? Boolean(suspend) : undefined;
      const isSuspended = userService.toggleSuspend(targetUserId, authUser, explicitStatus);
      return apiSuccess({ success: true, isSuspended });
    }

    // 3. Admin Update User (Admin Only)
    if (action === 'admin_update_user') {
      if (authUser.role !== 'ADMIN') {
        return apiError('Forbidden. Admin access required.', 403);
      }
      if (!targetUserId) {
        return apiError('targetUserId is required.', 400);
      }
      const updated = userService.adminUpdateUser(targetUserId, updates || {}, authUser);
      return apiSuccess(updated);
    }

    // 4. Update Own Profile
    const updated = userService.updateUser(authUser.id, updates || {});
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError(err.message || 'Failed to update user', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Admin access required.', 403);
    }

    const { searchParams } = new URL(req.url);
    let targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
      try {
        const body = await req.json();
        targetUserId = body.targetUserId;
      } catch (_) {}
    }

    if (!targetUserId) {
      return apiError('targetUserId is required.', 400);
    }

    userService.deleteUser(targetUserId, authUser);
    return apiSuccess({ success: true, message: 'User account deleted successfully.' });
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete user', 400);
  }
}
