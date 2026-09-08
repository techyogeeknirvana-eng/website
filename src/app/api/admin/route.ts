import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { adminService } from '@/lib/server/services/adminService';
import { userService } from '@/lib/server/services/userService';
import { getDatabase } from '@/lib/server/db/client';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Administrator access required.', 403);
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'overview';

    if (view === 'audit-logs') {
      const limit = parseInt(searchParams.get('limit') || '100', 10);
      const offset = parseInt(searchParams.get('offset') || '0', 10);
      const logs = adminService.getAuditLogs(limit, offset);
      return apiSuccess(logs);
    }

    if (view === 'reports') {
      const status = searchParams.get('status') || undefined;
      const reports = adminService.getReports(status);
      return apiSuccess(reports);
    }

    // Default: Platform Overview Metrics
    const db = getDatabase();
    const userCount = (db.prepare('SELECT COUNT(*) as c FROM users WHERE deleted_at IS NULL').get() as any).c;
    const oppCount = (db.prepare('SELECT COUNT(*) as c FROM opportunities WHERE deleted_at IS NULL').get() as any).c;
    const pendingOpps = (db.prepare("SELECT COUNT(*) as c FROM opportunities WHERE status = 'pending' AND deleted_at IS NULL").get() as any).c;
    const eventCount = (db.prepare('SELECT COUNT(*) as c FROM community_events WHERE deleted_at IS NULL').get() as any).c;
    const pendingEvents = (db.prepare("SELECT COUNT(*) as c FROM community_events WHERE status = 'pending' AND deleted_at IS NULL").get() as any).c;
    const pendingReports = (db.prepare("SELECT COUNT(*) as c FROM content_reports WHERE status = 'pending'").get() as any).c;

    return apiSuccess({
      users: userCount,
      opportunities: oppCount,
      pendingOpportunities: pendingOpps,
      events: eventCount,
      pendingEvents,
      pendingReports,
      totalPending: pendingOpps + pendingEvents + pendingReports,
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch admin data', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    if (!authUser || authUser.role !== 'ADMIN') {
      return apiError('Forbidden. Administrator access required.', 403);
    }

    const body = await req.json();
    const { action, reportId, status, note, targetUserId } = body;

    if (action === 'resolve_report') {
      if (!reportId || !status) return apiError('reportId and status required', 400);
      adminService.resolveReport(reportId, status, note || 'Resolved by admin', authUser);
      return apiSuccess({ success: true });
    }

    if (action === 'toggle_suspend') {
      if (!targetUserId) return apiError('targetUserId required', 400);
      const explicitStatus = body.suspend !== undefined ? Boolean(body.suspend) : undefined;
      const isSuspended = userService.toggleSuspend(targetUserId, authUser, explicitStatus);
      return apiSuccess({ isSuspended });
    }

    return apiError('Invalid action', 400);
  } catch (err: any) {
    return apiError(err.message || 'Admin action failed', 400);
  }
}
