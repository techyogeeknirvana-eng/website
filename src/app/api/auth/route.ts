import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/lib/server/middleware/authGuard';
import { authService } from '@/lib/server/services/authService';
import { creditService } from '@/lib/server/services/creditService';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { isValidEmail } from '@/lib/server/middleware/validator';
import { ensureDbReady } from '@/lib/server/db/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await ensureDbReady();
    const user = await extractAuthUser(req, true);
    if (!user) {
      return apiSuccess({ user: null, wallet: null, isAuthenticated: false, isSuspended: false });
    }

    if (user.isSuspended) {
      const response = apiSuccess({
        user: null,
        wallet: null,
        isAuthenticated: false,
        isSuspended: true,
        isAdmin: false,
        error: 'This account has been banned by a platform administrator. You cannot log in.'
      });
      response.cookies.delete('tygn_session_token');
      return response;
    }

    const cookieToken = req.cookies.get('tygn_session_token')?.value;
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const activeToken = cookieToken || bearerToken || null;

    const wallet = await creditService.getOrCreateWallet(user.id);
    return apiSuccess({
      user,
      wallet,
      token: activeToken,
      isAuthenticated: true,
      isAdmin: user.role === 'ADMIN',
      isSuspended: false,
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to verify session', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbReady();
    const body = await req.json();
    const { action, email, password, name, username, referralCode } = body;
    const ip = req.headers.get('x-forwarded-for') || req.ip;
    const userAgent = req.headers.get('user-agent') || undefined;

    if (!email || !isValidEmail(email)) {
      return apiError('Please provide a valid email address.', 400);
    }

    if (!password || password.length < 6) {
      return apiError('Password must be at least 6 characters long.', 400);
    }

    let result: { user: any; token: string };

    if (action === 'signup') {
      result = await authService.signUpWithPassword(
        {
          email,
          passwordPlain: password,
          name,
          username,
          referredByCode: referralCode,
        },
        ip,
        userAgent
      );
    } else {
      // Default to login
      result = await authService.loginWithPassword(email, password, ip, userAgent);
    }

    const isSuspended = Boolean(result.user.isSuspended);
    if (isSuspended) {
      const banResponse = apiError(
        'Account Banned: This account has been suspended by an administrator. You cannot log in.',
        403,
        { isSuspended: true }
      );
      banResponse.cookies.delete('tygn_session_token');
      return banResponse;
    }

    const wallet = await creditService.getOrCreateWallet(result.user.id);
    const response = apiSuccess({
      user: result.user,
      wallet,
      token: result.token,
      isAuthenticated: true,
      isAdmin: result.user.role === 'ADMIN',
      isSuspended: false,
    });

    // Set secure HTTP-Only cookie
    response.cookies.set({
      name: 'tygn_session_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    const isBan = err.message?.toLowerCase().includes('banned') || err.message?.toLowerCase().includes('suspended');
    const response = apiError(err.message || 'Authentication failed', isBan ? 403 : 400, { isSuspended: isBan });
    if (isBan) {
      response.cookies.delete('tygn_session_token');
    }
    return response;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('tygn_session_token')?.value;
    if (token) {
      await authService.logoutSession(token);
    }

    const response = apiSuccess({ loggedOut: true });
    response.cookies.delete('tygn_session_token');
    return response;
  } catch (err: any) {
    return apiError(err.message || 'Logout failed', 500);
  }
}
