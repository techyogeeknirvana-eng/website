import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { creditService } from '@/lib/server/services/creditService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId') || authUser?.id;
    const clientDate = searchParams.get('clientDate') || undefined;

    if (!requestedUserId) {
      return apiError('User ID required', 400);
    }

    const wallet = await creditService.getOrCreateWallet(requestedUserId, clientDate);
    const transactions = await creditService.getTransactions(requestedUserId, 20);

    return apiSuccess({ wallet, transactions });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch credit wallet', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await extractAuthUser(req);
    if (!authUser) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const { action, amount, description, feature, targetUserId, deltaDaily, deltaPersistent, reason, force, clientDate } = body;

    // 1. Daily Midnight Reset / Manual Refresh
    if (action === 'daily_reset') {
      if (authUser.role === 'ADMIN') {
        if (targetUserId) {
          const updatedWallet = await creditService.resetUserDailyCredits(targetUserId, Boolean(force), clientDate);
          return apiSuccess({ wallet: updatedWallet, message: 'User daily credits reset to 10.' });
        } else {
          const result = await creditService.resetAllDailyCredits(Boolean(force), clientDate);
          const callerWallet = await creditService.getOrCreateWallet(authUser.id, clientDate);
          return apiSuccess({
            wallet: callerWallet,
            count: result.count,
            message: `Daily credits reset successfully. ${result.count} wallets updated to 10 daily credits.`,
          });
        }
      } else {
        const updatedWallet = await creditService.resetUserDailyCredits(authUser.id, Boolean(force), clientDate);
        return apiSuccess({ wallet: updatedWallet, message: 'Daily credits reset to 10.' });
      }
    }

    // 2. Admin Credit Adjustment
    if (action === 'admin_adjust') {
      if (authUser.role !== 'ADMIN') {
        return apiError('Forbidden. Admin privileges required.', 403);
      }
      if (!targetUserId) {
        return apiError('targetUserId required for admin adjustment.', 400);
      }
      const updatedWallet = await creditService.adjustCreditsAdmin(
        targetUserId,
        parseInt(deltaDaily, 10) || 0,
        parseInt(deltaPersistent, 10) || 0,
        reason || 'Admin manual adjustment',
        authUser
      );
      return apiSuccess({ wallet: updatedWallet });
    }

    // 3. Standard Credit Deduction
    const deductAmount = parseInt(amount, 10) || 1;
    const res = await creditService.deductCredits(
      authUser.id,
      deductAmount,
      description || 'Platform feature usage',
      feature || 'system'
    );

    if (!res.success) {
      return apiError(res.error || 'Insufficient credit balance.', 402, { wallet: res.wallet });
    }

    return apiSuccess({ wallet: res.wallet, transaction: res.transaction });
  } catch (err: any) {
    return apiError(err.message || 'Credit operation failed', 400);
  }
}
