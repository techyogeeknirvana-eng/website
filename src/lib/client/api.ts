/**
 * Typed Client API SDK for Techyogeek Nirvana
 * Centralized HTTP communication layer for all frontend components.
 */

import { User, Opportunity, CommunityEvent, CommunityMessage, NirvanaMoment, Project, CreditWallet, SystemAnnouncement, AuditLog, ContentReport, LiveSession, LiveParticipant } from '@/types';

async function request<T>(url: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null; pagination?: any }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tygn_session_token') : null;
    const activeUserId = typeof window !== 'undefined' ? localStorage.getItem('tygn_active_user_id') : null;
    const activeUserEmail = typeof window !== 'undefined' ? localStorage.getItem('tygn_active_user_email') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token && !headers['Authorization'] && token !== 'tygn_server_session_active') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (activeUserId && !headers['x-user-id']) {
      headers['x-user-id'] = activeUserId;
    }
    if (activeUserEmail && !headers['x-user-email']) {
      headers['x-user-email'] = activeUserEmail;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent and received
    });

    const json = await res.json();
    if (!res.ok || json.success === false) {
      return { data: null, error: json.error || `HTTP ${res.status} Error`, pagination: json.pagination };
    }

    return { data: json.data, error: null, pagination: json.pagination };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network request failed' };
  }
}

export const api = {
  // Authentication
  auth: {
    getSession: () => request<{ user: User | null; wallet: CreditWallet | null; token?: string | null; isAuthenticated: boolean; isAdmin: boolean; isSuspended?: boolean }>('/api/auth'),
    login: (email: string, password: string) =>
      request<{ user: User; wallet: CreditWallet | null; token: string; isSuspended?: boolean }>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', email, password }),
      }),
    signup: (data: { email: string; password: string; name?: string; username?: string; referralCode?: string }) =>
      request<{ user: User; wallet: CreditWallet | null; token: string; isSuspended?: boolean }>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'signup', ...data }),
      }),
    googleLogin: (data: { email: string; name?: string; avatar?: string; referralCode?: string }) =>
      request<{ user: User; wallet: CreditWallet | null; token: string; isSuspended?: boolean }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () => request<{ loggedOut: boolean }>('/api/auth', { method: 'DELETE' }),
  },

  // Users
  users: {
    list: () => request<User[]>(`/api/users?_t=${Date.now()}`),
    updateProfile: (updates: Partial<User>) =>
      request<User>('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
      }),
    changeRole: (targetUserId: string, role: 'USER' | 'ADMIN') =>
      request<{ success: boolean }>('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'change_role', targetUserId, role }),
      }),
    toggleSuspend: (targetUserId: string, suspend?: boolean) =>
      request<{ success: boolean; isSuspended: boolean }>('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'toggle_suspend', targetUserId, suspend }),
      }),
    adminUpdate: (targetUserId: string, updates: Partial<User>) =>
      request<User>('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'admin_update_user', targetUserId, updates }),
      }),
    delete: (targetUserId: string) =>
      request<{ success: boolean; message: string }>(`/api/users?targetUserId=${encodeURIComponent(targetUserId)}`, {
        method: 'DELETE',
      }),
  },

  // Credits
  credits: {
    getWallet: (userId?: string, clientDate?: string) => {
      const today = clientDate || (typeof window !== 'undefined' ? new Date().toLocaleDateString('en-CA') : undefined);
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      if (today) params.set('clientDate', today);
      const qs = params.toString();
      return request<{ wallet: CreditWallet; transactions: any[] }>(`/api/credits${qs ? `?${qs}` : ''}`);
    },
    deduct: (amount: number, description: string, feature: string) =>
      request<{ wallet: CreditWallet; transaction: any }>('/api/credits', {
        method: 'POST',
        body: JSON.stringify({ amount, description, feature }),
      }),
    resetDaily: (force = false, clientDate?: string, targetUserId?: string) => {
      const today = clientDate || (typeof window !== 'undefined' ? new Date().toLocaleDateString('en-CA') : undefined);
      return request<{ wallet: CreditWallet; count?: number; message?: string }>('/api/credits', {
        method: 'POST',
        body: JSON.stringify({ action: 'daily_reset', force, clientDate: today, targetUserId }),
      });
    },
    adminAdjust: (targetUserId: string, deltaDaily: number, deltaPersistent: number, reason: string) =>
      request<{ wallet: CreditWallet }>('/api/credits', {
        method: 'POST',
        body: JSON.stringify({ action: 'admin_adjust', targetUserId, deltaDaily, deltaPersistent, reason }),
      }),
  },

  // Opportunities
  opportunities: {
    list: (params?: { status?: string; type?: string; search?: string; isRemote?: boolean; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.type) q.set('type', params.type);
      if (params?.search) q.set('search', params.search);
      if (params?.isRemote !== undefined) q.set('isRemote', String(params.isRemote));
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return request<Opportunity[]>(`/api/opportunities?${q.toString()}`);
    },
    create: (data: Partial<Opportunity>) =>
      request<Opportunity>('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleSave: (opportunityId: string) =>
      request<{ isSaved: boolean }>('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify({ action: 'save', opportunityId }),
      }),
    review: (id: string, status: string, rejectionReason?: string) =>
      request<Opportunity>('/api/opportunities', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, rejectionReason }),
      }),
    update: (id: string, updates: Partial<Opportunity>) =>
      request<Opportunity>('/api/opportunities', {
        method: 'PATCH',
        body: JSON.stringify({ id, action: 'modify', updates }),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/opportunities?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
  },

  // Community Events
  events: {
    list: (params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return request<CommunityEvent[]>(`/api/events?${q.toString()}`);
    },
    create: (data: Partial<CommunityEvent>) =>
      request<CommunityEvent>('/api/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleRSVP: (eventId: string) =>
      request<{ isRegistered: boolean }>('/api/events', {
        method: 'POST',
        body: JSON.stringify({ action: 'rsvp', eventId }),
      }),
    review: (id: string, status: string, rejectionReason?: string) =>
      request<CommunityEvent>('/api/events', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, rejectionReason }),
      }),
    update: (id: string, updates: Partial<CommunityEvent>) =>
      request<CommunityEvent>('/api/events', {
        method: 'PATCH',
        body: JSON.stringify({ id, action: 'modify', updates }),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/events?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
  },

  // Community Chat
  community: {
    getChannels: () => request<{ channels: any[] }>('/api/community'),
    getMessages: (channelSlug: string, limit = 50, before?: string) =>
      request<{ channelSlug: string; messages: CommunityMessage[] }>(
        `/api/community?channel=${channelSlug}&limit=${limit}${before ? `&before=${before}` : ''}`
      ),
    postMessage: (channelSlug: string, content: string, codeSnippet?: any, replyToId?: string) =>
      request<CommunityMessage>('/api/community', {
        method: 'POST',
        body: JSON.stringify({ channelSlug, content, codeSnippet, replyToId }),
      }),
    toggleReaction: (messageId: string, emoji: string) =>
      request<{ isAdded: boolean }>('/api/community', {
        method: 'POST',
        body: JSON.stringify({ action: 'reaction', messageId, emoji }),
      }),
    editMessage: (messageId: string, content: string) =>
      request<{ success: boolean; message: string; content: string }>('/api/community', {
        method: 'PATCH',
        body: JSON.stringify({ messageId, content }),
      }),
    pinMessage: (messageId: string, isPinned: boolean) =>
      request<{ success: boolean; isPinned: boolean }>('/api/community', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'pin', messageId, isPinned }),
      }),
    deleteMessage: (messageId: string) =>
      request<{ success: boolean; message: string }>(`/api/community?messageId=${encodeURIComponent(messageId)}`, {
        method: 'DELETE',
      }),
  },

  // Moments
  moments: {
    list: (limit = 50, offset = 0, includePending = false) =>
      request<NirvanaMoment[]>(`/api/moments?limit=${limit}&offset=${offset}${includePending ? '&includePending=true' : ''}`),
    create: (content: string, category: string, imageUrl?: string) =>
      request<NirvanaMoment>('/api/moments', {
        method: 'POST',
        body: JSON.stringify({ content, category, imageUrl }),
      }),
    review: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
      request<{ success: boolean }>('/api/moments', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, rejectionReason }),
      }),
    update: (id: string, updates: Partial<NirvanaMoment>) =>
      request<NirvanaMoment>('/api/moments', {
        method: 'PATCH',
        body: JSON.stringify({ id, action: 'modify', updates }),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/moments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
    toggleLike: (momentId: string) =>
      request<{ isLiked: boolean }>('/api/moments', {
        method: 'POST',
        body: JSON.stringify({ action: 'like', momentId }),
      }),
    addComment: (momentId: string, content: string) =>
      request<any>('/api/moments', {
        method: 'POST',
        body: JSON.stringify({ action: 'comment', momentId, content }),
      }),
  },

  // Projects
  projects: {
    list: (category?: string, includePending = false) => {
      const q = new URLSearchParams();
      if (category && category !== 'All') q.set('category', category);
      if (includePending) q.set('includePending', 'true');
      const qs = q.toString();
      return request<Project[]>(`/api/projects${qs ? `?${qs}` : ''}`);
    },
    create: (data: Partial<Project>) =>
      request<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    review: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
      request<{ success: boolean }>('/api/projects', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, rejectionReason }),
      }),
    update: (id: string, updates: Partial<Project>) =>
      request<Project>('/api/projects', {
        method: 'PATCH',
        body: JSON.stringify({ id, action: 'modify', updates }),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
    toggleLike: (projectId: string) =>
      request<{ isLiked: boolean }>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ action: 'like', projectId }),
      }),
  },

  // Announcements
  announcements: {
    getActive: () => request<SystemAnnouncement[]>('/api/announcements'),
    dismiss: (announcementId: string) =>
      request<{ dismissed: boolean }>('/api/announcements', {
        method: 'POST',
        body: JSON.stringify({ action: 'dismiss', announcementId }),
      }),
    create: (data: { title: string; message: string; targetAudience?: string; badge?: string; expiresAt?: string }) =>
      request<SystemAnnouncement>('/api/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => request<{ deleted: boolean }>(`/api/announcements?id=${id}`, { method: 'DELETE' }),
  },

  // Admin
  admin: {
    getOverview: () => request<any>('/api/admin?view=overview'),
    getAuditLogs: (limit = 100, offset = 0) =>
      request<AuditLog[]>(`/api/admin?view=audit-logs&limit=${limit}&offset=${offset}`),
    getReports: (status?: string) => request<ContentReport[]>(`/api/admin?view=reports${status ? `&status=${status}` : ''}`),
    resolveReport: (reportId: string, status: 'resolved' | 'dismissed', note?: string) =>
      request<{ success: boolean }>('/api/admin', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'resolve_report', reportId, status, note }),
      }),
  },

  // Live Sessions
  live: {
    get: (code: string) => request<LiveSession>(`/api/live?code=${encodeURIComponent(code)}`),
    create: (session: LiveSession) =>
      request<{ success: boolean; session: LiveSession }>('/api/live', {
        method: 'POST',
        body: JSON.stringify({ action: 'create', session }),
      }),
    join: (code: string, nickname: string, avatar?: string, participantId?: string) =>
      request<{ success: boolean; participant: LiveParticipant; session: LiveSession }>('/api/live', {
        method: 'POST',
        body: JSON.stringify({
          action: 'join',
          code,
          participant: { id: participantId, nickname, avatar },
        }),
      }),
    answer: (code: string, participantId: string, selectedOption?: number, textResponse?: string, timeTaken: number = 5) =>
      request<{ success: boolean; isCorrect: boolean; pointsEarned: number; session: LiveSession }>('/api/live', {
        method: 'POST',
        body: JSON.stringify({
          action: 'answer',
          code,
          participant: { id: participantId },
          selectedOption,
          textResponse,
          timeTaken,
        }),
      }),
    updateStatus: (code: string, status: LiveSession['status'], nextSlideIndex?: number) =>
      request<{ success: boolean; session: LiveSession }>('/api/live', {
        method: 'POST',
        body: JSON.stringify({
          action: 'status',
          code,
          status,
          nextSlideIndex,
        }),
      }),
  },
};
