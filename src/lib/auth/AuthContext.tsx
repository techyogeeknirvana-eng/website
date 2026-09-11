'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CreditWallet, SystemAnnouncement, CreditTransaction } from '@/types';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { GoogleAuthModal } from '@/components/auth/GoogleAuthModal';
import { GoogleOAuthModal } from '@/components/auth/GoogleOAuthModal';
import { api } from '@/lib/client/api';
import { formatNameFromEmail } from '@/lib/auth/nameUtils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error?: any }>;
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGoogleLoggedIn: boolean;
  sessionToken: string | null;
  isLoading: boolean;
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  isGoogleChooserOpen: boolean;
  openGoogleChooser: () => void;
  closeGoogleChooser: () => void;
  loginWithGoogle: (email: string, name: string, avatar?: string, role?: UserRole) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ success: boolean; requiresVerification?: boolean; otp?: string; error?: string }>;
  verifyEmailOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationOtp: (email: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  switchUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
  deleteAccount: () => void;
  allUsers: User[];
  refreshUserData: () => void;
  wallet: CreditWallet | null;
  refreshWallet: () => void;
  deductCredits: (
    amount: number,
    description: string,
    feature?: 'chat' | 'resume' | 'admin' | 'system' | 'referral' | 'purchase'
  ) => Promise<{ success: boolean; wallet?: CreditWallet; error?: string }>;
  activeAnnouncements: SystemAnnouncement[];
  dismissAnnouncement: (id: string) => void;
}

export const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL];

export const isGlobalAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Hydrate initial state synchronously from localStorage so tab switches never flash as unauthenticated
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = localStorage.getItem('tygn_user_profile');
        if (storedProfile) return JSON.parse(storedProfile);
      } catch (_) {}
    }
    return null;
  });

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('tygn_session_token') || null;
      } catch (_) {}
    }
    return null;
  });

  const [wallet, setWallet] = useState<CreditWallet | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedWallet = localStorage.getItem('tygn_user_wallet');
        if (storedWallet) return JSON.parse(storedWallet);
      } catch (_) {}
    }
    return null;
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [activeAnnouncements, setActiveAnnouncements] = useState<SystemAnnouncement[]>([]);

  // Initialize and validate session from real backend server on fresh browser load
  useEffect(() => {
    async function initSession() {
      try {
        const sessionRes = await api.auth.getSession();

        if (sessionRes.data?.isAuthenticated && sessionRes.data?.user && !sessionRes.data?.isSuspended && !sessionRes.data.user.isSuspended) {
          const u = sessionRes.data.user;
          const w = sessionRes.data.wallet;
          const activeTok = sessionRes.data.token || (typeof window !== 'undefined' ? localStorage.getItem('tygn_session_token') : null) || 'tygn_session_active';

          setCurrentUser(u);
          setWallet(w);
          setSessionToken(activeTok);

          if (typeof window !== 'undefined') {
            localStorage.setItem('tygn_user_profile', JSON.stringify(u));
            localStorage.setItem('tygn_session_token', activeTok);
            localStorage.setItem('tygn_active_user_id', u.id);
            localStorage.setItem('tygn_active_user_email', u.email);
            if (w) localStorage.setItem('tygn_user_wallet', JSON.stringify(w));
            localStorage.removeItem('tygn_is_suspended');
          }
          dbStore.addUser(u);
        } else if (!sessionRes.error && sessionRes.data && sessionRes.data.isAuthenticated === false) {
          // Only drop session if server cleanly responded with 200 OK and explicitly confirmed unauthenticated
          // (Never drop on network error or server cold start)
          setCurrentUser(null);
          setSessionToken(null);
          setWallet(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('tygn_user_profile');
            localStorage.removeItem('tygn_user_wallet');
            localStorage.removeItem('tygn_active_user_id');
            localStorage.removeItem('tygn_active_user_email');
            localStorage.removeItem('tygn_session_token');
            localStorage.removeItem('tygn_google_auth');
            if (sessionRes.data?.isSuspended) {
              localStorage.setItem('tygn_is_suspended', 'true');
            } else {
              localStorage.removeItem('tygn_is_suspended');
            }
          }
        }

        // Fetch registered platform users
        const usersRes = await api.users.list();
        if (usersRes.data) {
          const seen = new Set<string>();
          const deduped: User[] = [];
          for (const user of usersRes.data) {
            const key = (user.email || user.id).toLowerCase().trim();
            const id = user.id || '';
            const name = (user.name || '').toLowerCase();
            if (id === 'user_aarav' || key.includes('example.com') || name.includes('aarav') || user.username === 'aarav_codes') {
              continue;
            }
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(user);
            }
          }
          dbStore.setUsers(deduped);
          setAllUsers(deduped);
        }

        // Fetch active platform announcements
        const annRes = await api.announcements.getActive();
        if (annRes.data) {
          setActiveAnnouncements(annRes.data);
        }
      } catch (err) {
        console.warn('Session initialization warning:', err);
        // Do not wipe user on network failure; keep optimistic state
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  // Periodic real-time sync: NEVER logs out on network error or background tab throttle
  useEffect(() => {
    const interval = setInterval(async () => {
      const localToday = typeof window !== 'undefined' ? new Date().toLocaleDateString('en-CA') : undefined;
      dbStore.checkAndResetDailyCredits(false, localToday);

      if (currentUser) {
        try {
          // If local day rolled over, ensure server wallet resets daily credits to 10
          if (wallet && localToday && wallet.lastDailyReset !== localToday) {
            await api.credits.resetDaily(false, localToday);
          }

          const sessionRes = await api.auth.getSession();

          // If network errored (e.g. background tab throttled or connection hiccup), DO NOT LOG OUT!
          if (sessionRes.error) {
            return;
          }

          if (sessionRes.data?.isSuspended) {
            // Explicit ban by administrator
            setCurrentUser(null);
            setSessionToken(null);
            setWallet(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('tygn_user_profile');
              localStorage.removeItem('tygn_user_wallet');
              localStorage.removeItem('tygn_active_user_id');
              localStorage.removeItem('tygn_session_token');
              localStorage.removeItem('tygn_google_auth');
              localStorage.setItem('tygn_is_suspended', 'true');
            }
            alert('ACCESS REVOKED: This account has been banned by a platform administrator. You have been logged out.');
            return;
          }

          // If the server couldn't verify on this tick (e.g. serverless container cold start), DO NOT wipe the user!
          // Background sync must never log out a user with an active token. Only explicit logout or admin ban logs out.
          if (sessionRes.data && sessionRes.data.isAuthenticated === false) {
            const hasLocalToken = typeof window !== 'undefined' ? localStorage.getItem('tygn_session_token') : null;
            if (!hasLocalToken) {
              setCurrentUser(null);
              setSessionToken(null);
              setWallet(null);
            }
            return;
          }

          if (sessionRes.data?.user) {
            const fresh = sessionRes.data.user;
            if (fresh.referralCount !== currentUser.referralCount || fresh.avatar !== currentUser.avatar) {
              setCurrentUser((prev) => (prev ? { ...prev, referralCount: fresh.referralCount, avatar: fresh.avatar } : fresh));
              if (typeof window !== 'undefined') {
                localStorage.setItem('tygn_user_profile', JSON.stringify(fresh));
              }
            }
          }

          const wRes = await api.credits.getWallet(currentUser.id, localToday);
          if (wRes.data?.wallet) {
            setWallet({ ...wRes.data.wallet });
            if (typeof window !== 'undefined') {
              localStorage.setItem('tygn_user_wallet', JSON.stringify(wRes.data.wallet));
            }
          }
        } catch (err) {
          // Background sync network error: ignore silently, do not disturb user
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUser, wallet]);

  const refreshUserData = async () => {
    try {
      const usersRes = await api.users.list();
      if (usersRes.data) {
        const seen = new Set<string>();
        const deduped: User[] = [];
        for (const u of usersRes.data) {
          const key = (u.email || u.id).toLowerCase().trim();
          const id = u.id || '';
          const name = (u.name || '').toLowerCase();
          if (id === 'user_aarav' || key.includes('example.com') || name.includes('aarav') || u.username === 'aarav_codes') {
            continue;
          }
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(u);
          }
        }
        dbStore.setUsers(deduped);
        setAllUsers(deduped);
        if (currentUser) {
          const refreshed = deduped.find((u) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase());
          if (refreshed) {
            setCurrentUser(refreshed);
            if (typeof window !== 'undefined') {
              localStorage.setItem('tygn_user_profile', JSON.stringify(refreshed));
            }
          }
        }
      }

      if (currentUser) {
        const wRes = await api.credits.getWallet(currentUser.id);
        if (wRes.data?.wallet) {
          setWallet(wRes.data.wallet);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tygn_user_wallet', JSON.stringify(wRes.data.wallet));
          }
        }
        const annRes = await api.announcements.getActive();
        if (annRes.data) {
          setActiveAnnouncements(annRes.data);
        }
      }
    } catch (e) {
      console.warn('refreshUserData error:', e);
    }
  };

  const refreshWallet = async () => {
    if (currentUser) {
      const wRes = await api.credits.getWallet(currentUser.id);
      if (wRes.data?.wallet) {
        setWallet(wRes.data.wallet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tygn_user_wallet', JSON.stringify(wRes.data.wallet));
        }
      }
    }
  };

  const deductCredits = async (
    amount: number,
    description: string,
    feature?: 'chat' | 'resume' | 'admin' | 'system' | 'referral' | 'purchase'
  ): Promise<{ success: boolean; wallet?: CreditWallet; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Authentication required' };
    
    const res = await api.credits.deduct(amount, description, feature || 'system');
    if (res.data?.wallet) {
      setWallet(res.data.wallet);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tygn_user_wallet', JSON.stringify(res.data.wallet));
      }
      dbStore.deductCredits(currentUser.id, amount, description, feature);
      return { success: true, wallet: res.data.wallet };
    }
    return { success: false, error: res.error || 'Insufficient credits' };
  };

  const dismissAnnouncement = async (announcementId: string) => {
    if (!currentUser) return;
    setActiveAnnouncements((prev: SystemAnnouncement[]) => prev.filter((a: SystemAnnouncement) => a.id !== announcementId));
    await api.announcements.dismiss(announcementId);
    dbStore.dismissAnnouncement(currentUser.id, announcementId);
  };

  const openGoogleModal = () => {
    soundEffects.playClick();
    setIsGoogleModalOpen(true);
  };

  const closeGoogleModal = () => {
    setIsGoogleModalOpen(false);
  };

  const openGoogleChooser = () => {
    soundEffects.playClick();
    signInWithGoogle();
  };

  const closeGoogleChooser = () => {
    setIsGoogleChooserOpen(false);
  };

  const loginWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid Gmail / Email address.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const res = await api.auth.login(cleanEmail, password);
    if (res.data?.user && !res.data?.isSuspended && !res.data.user.isSuspended) {
      setCurrentUser(res.data.user);
      setWallet(res.data.wallet);
      setSessionToken(res.data.token);
      dbStore.addUser(res.data.user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('tygn_user_profile', JSON.stringify(res.data.user));
        localStorage.setItem('tygn_google_auth', 'true');
        localStorage.setItem('tygn_session_token', res.data.token);
        localStorage.setItem('tygn_active_user_id', res.data.user.id);
        localStorage.setItem('tygn_active_user_email', res.data.user.email);
        if (res.data.wallet) {
          localStorage.setItem('tygn_user_wallet', JSON.stringify(res.data.wallet));
        }
        localStorage.removeItem('tygn_is_suspended');
      }

      await refreshUserData();
      soundEffects.playSuccess();
      closeGoogleModal();
      return { success: true };
    }
    const err = res.error || (res.data?.isSuspended ? 'Account Banned: This account has been suspended by an administrator. You cannot log in.' : 'Invalid credentials');
    return { success: false, error: err };
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; requiresVerification?: boolean; otp?: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid Gmail / Email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const pendingRef =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('tygn_pending_referral') || localStorage.getItem('tygn_pending_referral') || undefined
        : undefined;

    const res = await api.auth.signup({
      email: cleanEmail,
      password,
      name,
      referralCode: pendingRef,
    });

    if (res.data?.user && !res.data?.isSuspended && !res.data.user.isSuspended) {
      setCurrentUser(res.data.user);
      setWallet(res.data.wallet);
      setSessionToken(res.data.token);
      dbStore.addUser(res.data.user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('tygn_user_profile', JSON.stringify(res.data.user));
        localStorage.setItem('tygn_google_auth', 'true');
        localStorage.setItem('tygn_session_token', res.data.token);
        localStorage.setItem('tygn_active_user_id', res.data.user.id);
        localStorage.setItem('tygn_active_user_email', res.data.user.email);
        if (res.data.wallet) {
          localStorage.setItem('tygn_user_wallet', JSON.stringify(res.data.wallet));
        }
        localStorage.removeItem('tygn_is_suspended');
        sessionStorage.removeItem('tygn_pending_referral');
        localStorage.removeItem('tygn_pending_referral');
      }

      await refreshUserData();
      soundEffects.playSuccess();
      closeGoogleModal();
      return { success: true };
    }

    return { success: false, error: res.error || 'Account creation failed.' };
  };

  const verifyEmailOtp = async (
    email: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> => {
    return { success: true };
  };

  const resendVerificationOtp = async (
    email: string
  ): Promise<{ success: boolean; otp?: string; error?: string }> => {
    return { success: true };
  };

  const loginWithGoogle = async (email: string, name: string, avatar?: string, role?: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const candidateName = formatNameFromEmail(cleanEmail, name);
    const pendingRef =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('tygn_pending_referral') || localStorage.getItem('tygn_pending_referral') || undefined
        : undefined;

    const res = await api.auth.googleLogin({
      email: cleanEmail,
      name: candidateName,
      avatar,
      referralCode: pendingRef,
    });

    if (res.data?.user && !res.data?.isSuspended && !res.data.user.isSuspended) {
      setCurrentUser(res.data.user);
      setWallet(res.data.wallet);
      setSessionToken(res.data.token);
      dbStore.addUser(res.data.user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('tygn_user_profile', JSON.stringify(res.data.user));
        localStorage.setItem('tygn_google_auth', 'true');
        localStorage.setItem('tygn_session_token', res.data.token);
        localStorage.setItem('tygn_active_user_id', res.data.user.id);
        localStorage.setItem('tygn_active_user_email', res.data.user.email);
        if (res.data.wallet) {
          localStorage.setItem('tygn_user_wallet', JSON.stringify(res.data.wallet));
        }
        localStorage.removeItem('tygn_is_suspended');
        sessionStorage.removeItem('tygn_pending_referral');
        localStorage.removeItem('tygn_pending_referral');
      }

      await refreshUserData();
      soundEffects.playSuccess();
      closeGoogleModal();
      closeGoogleChooser();
    } else {
      const isBanned = res.error?.toLowerCase().includes('banned') || res.error?.toLowerCase().includes('suspended') || res.data?.isSuspended;
      const errorMsg = isBanned
        ? (res.error || 'Account Banned: This account has been suspended by a platform administrator. You cannot log in.')
        : (res.error || 'Google login failed');

      soundEffects.playError?.();
      alert(errorMsg);

      setCurrentUser(null);
      setSessionToken(null);
      setWallet(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tygn_user_profile');
        localStorage.removeItem('tygn_user_wallet');
        localStorage.removeItem('tygn_session_token');
        localStorage.removeItem('tygn_active_user_id');
        localStorage.removeItem('tygn_google_auth');
        if (isBanned) {
          localStorage.setItem('tygn_is_suspended', 'true');
        }
      }
    }
  };

  const switchUser = (userId: string) => {
    if (!currentUser || !sessionToken) return;
    const user = allUsers.find((u: User) => u.id === userId);
    if (user && user.role !== 'ADMIN') {
      setCurrentUser(user);
      localStorage.setItem('tygn_active_user_id', user.id);
      localStorage.setItem('tygn_user_profile', JSON.stringify(user));
      soundEffects.playClick();
    }
  };

  const switchUserRole = (role: UserRole) => {
    if (!currentUser || !sessionToken || role === 'ADMIN') return;
    const targetUser = allUsers.find((u: User) => u.role === role);
    if (targetUser) {
      switchUser(targetUser.id);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const res = await api.users.updateProfile(updates);
    if (res.data) {
      setCurrentUser(res.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tygn_user_profile', JSON.stringify(res.data));
      }
      dbStore.updateUser(res.data);
      soundEffects.playSuccess();
    }
  };

  // TRUE LOGOUT: Calls backend logout endpoint and completely clears authentication session
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn('Logout endpoint error:', e);
    }

    setCurrentUser(null);
    setWallet(null);
    setSessionToken(null);

    // Completely wipe auth session keys from browser storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tygn_user_profile');
      localStorage.removeItem('tygn_user_wallet');
      localStorage.removeItem('tygn_is_suspended');
      localStorage.removeItem('tygn_google_auth');
      localStorage.removeItem('tygn_session_token');
      localStorage.removeItem('tygn_active_user_id');
      localStorage.removeItem('tygn_active_user_email');
    }

    soundEffects.playClick();
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    logout();
  };

  // Resilient authentication check: True whenever valid user and session token exist
  const isAuthenticated = Boolean(currentUser && sessionToken);
  const isAdmin = Boolean(
    currentUser &&
    isAuthenticated &&
    (isGlobalAdminEmail(currentUser.email) || currentUser.role === 'ADMIN')
  );

  const loadGoogleScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).google?.accounts?.oauth2) return resolve(true);

      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        if ((window as any).google?.accounts?.oauth2) return resolve(true);
        existing.addEventListener('load', () => resolve(true));
        setTimeout(() => resolve(!!(window as any).google?.accounts?.oauth2), 600);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const signInWithGoogle = async (): Promise<{ error?: any }> => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      (typeof window !== 'undefined' ? localStorage.getItem('tygn_google_client_id') : null) ||
      '692683182952-05t988nb5p45bj69rb03jsitpb0j3e8k.apps.googleusercontent.com';

    await loadGoogleScript();

    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      return new Promise((resolve) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                console.warn('Google OAuth token error:', tokenResponse);
                resolve({ error: new Error(tokenResponse.error_description || tokenResponse.error) });
                return;
              }
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                if (profile && profile.email) {
                  const googleName = profile.name && profile.name.trim() ? profile.name.trim() : '';
                  const resolvedName = formatNameFromEmail(profile.email, googleName);
                  loginWithGoogle(profile.email, resolvedName, profile.picture);
                  resolve({ error: null });
                } else {
                  resolve({ error: new Error('Unable to retrieve profile from Google') });
                }
              } catch (err) {
                resolve({ error: err });
              }
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        } catch (e) {
          console.error('Google OAuth init error:', e);
          setIsGoogleChooserOpen(true);
          resolve({ error: e });
        }
      });
    }

    setIsGoogleChooserOpen(true);
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading: isLoading,
        signInWithGoogle,
        currentUser,
        isAuthenticated,
        isAdmin,
        isGoogleLoggedIn: isAuthenticated,
        sessionToken,
        isLoading,
        isGoogleModalOpen,
        openGoogleModal,
        closeGoogleModal,
        isGoogleChooserOpen,
        openGoogleChooser,
        closeGoogleChooser,
        loginWithGoogle,
        loginWithPassword,
        signUpWithPassword,
        verifyEmailOtp,
        resendVerificationOtp,
        switchUserRole,
        switchUser,
        updateProfile,
        logout,
        deleteAccount,
        allUsers,
        refreshUserData,
        wallet,
        refreshWallet,
        deductCredits,
        activeAnnouncements,
        dismissAnnouncement,
      }}
    >
      {children}
      <GoogleAuthModal isOpen={isGoogleModalOpen} onClose={closeGoogleModal} />
      <GoogleOAuthModal isOpen={isGoogleChooserOpen} onClose={closeGoogleChooser} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
