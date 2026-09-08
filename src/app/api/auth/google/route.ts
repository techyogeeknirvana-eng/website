import { NextRequest } from 'next/server';
import { authService } from '@/lib/server/services/authService';
import { creditService } from '@/lib/server/services/creditService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { isValidEmail } from '@/lib/server/middleware/validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, referralCode } = body;
    const ip = req.headers.get('x-forwarded-for') || req.ip;
    const userAgent = req.headers.get('user-agent') || undefined;

    if (!email || !isValidEmail(email)) {
      return apiError('Valid Google account email is required.', 400);
    }

    const result = await authService.loginOrSyncGoogle(
      email,
      name,
      avatar,
      referralCode,
      ip,
      userAgent
    );

    const isSuspended = Boolean(result.user.isSuspended);
    if (isSuspended) {
      const banResponse = apiError(
        'Account Banned: This account has been suspended by a platform administrator. You cannot log in.',
        403,
        { isSuspended: true }
      );
      banResponse.cookies.delete('tygn_session_token');
      return banResponse;
    }

    const wallet = creditService.getOrCreateWallet(result.user.id);

    const response = apiSuccess({
      user: result.user,
      wallet,
      token: result.token,
      isAuthenticated: true,
      isAdmin: result.user.role === 'ADMIN',
      isSuspended: false,
    });

    response.cookies.set({
      name: 'tygn_session_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    const isBan = err.message?.toLowerCase().includes('banned') || err.message?.toLowerCase().includes('suspended');
    const response = apiError(err.message || 'Google authentication failed', isBan ? 403 : 400, { isSuspended: isBan });
    if (isBan) {
      response.cookies.delete('tygn_session_token');
    }
    return response;
  }
}
