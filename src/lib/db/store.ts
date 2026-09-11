import {
  User,
  Opportunity,
  CommunityEvent,
  CommunityChannel,
  CommunityMessage,
  NirvanaMoment,
  Project,
  Quiz,
  LiveSession,
  LiveParticipant,
  LiveResponse,
  AuditLog,
  ContentReport,
  TechRadarItem,
  CollabRequest,
  LearningPath,
  SubmissionStatus,
  CreditWallet,
  CreditTransaction,
  Referral,
  SystemAnnouncement,
  UserRole
} from '@/types';
import {
  SEED_USERS,
  SEED_CHANNELS,
  SEED_MESSAGES,
  SEED_OPPORTUNITIES,
  SEED_EVENTS,
  SEED_MOMENTS,
  SEED_PROJECTS,
  SEED_QUIZZES,
  SEED_TECH_RADAR,
  SEED_COLLAB_REQUESTS,
  SEED_LEARNING_PATHS,
  SEED_AUDIT_LOGS,
  SEED_REPORTS
} from './seedData';
import { formatNameFromEmail } from '@/lib/auth/nameUtils';

export const DAILY_DEFAULT_ALLOWANCE = 10;
export const REFERRAL_BONUS_CREDITS = 10;
export const CHAT_MESSAGE_CREDIT_COST = 1;
export const RESUME_SCAN_CREDIT_COST = 2;

export const SEED_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ann_welcome',
    title: '🚀 Welcome to Techyogeek Nirvana!',
    message: 'Every member receives 10 free daily credits each day for community discussions and AI resume evaluations. Invite your friends with your unique referral link to earn 10 permanent credits per sign-up!',
    targetAudience: 'ALL',
    createdBy: 'System Lead',
    createdAt: '2025-01-01T00:00:00.000Z',
    active: true,
    badge: 'COMMUNITY ANNOUNCEMENT',
  },
];

const STORAGE_KEYS = {
  USERS: 'tygn_users_v1',
  OPPORTUNITIES: 'tygn_opportunities_v1',
  EVENTS: 'tygn_events_v1',
  MESSAGES: 'tygn_messages_v1',
  MOMENTS: 'tygn_moments_v1',
  PROJECTS: 'tygn_projects_v1',
  QUIZZES: 'tygn_quizzes_v1',
  LIVE_SESSIONS: 'tygn_live_sessions_v1',
  AUDIT_LOGS: 'tygn_audit_logs_v1',
  REPORTS: 'tygn_reports_v1',
  COLLAB: 'tygn_collab_v1',
  CURRENT_USER: 'tygn_current_user_v1',
  WALLETS: 'tygn_wallets_v1',
  TRANSACTIONS: 'tygn_transactions_v1',
  REFERRALS: 'tygn_referrals_v1',
  ANNOUNCEMENTS: 'tygn_announcements_v1',
  DISMISSED_ANNOUNCEMENTS: 'tygn_dismissed_announcements_v1',
};

class DataStore {
  private users: User[] = SEED_USERS;
  private opportunities: Opportunity[] = SEED_OPPORTUNITIES;
  private events: CommunityEvent[] = SEED_EVENTS;
  private channels: CommunityChannel[] = SEED_CHANNELS;
  private messages: CommunityMessage[] = SEED_MESSAGES;
  private moments: NirvanaMoment[] = SEED_MOMENTS;
  private projects: Project[] = SEED_PROJECTS;
  private quizzes: Quiz[] = SEED_QUIZZES;
  private liveSessions: Record<string, LiveSession> = {};
  private auditLogs: AuditLog[] = SEED_AUDIT_LOGS;
  private reports: ContentReport[] = SEED_REPORTS;
  private collabRequests: CollabRequest[] = SEED_COLLAB_REQUESTS;
  private techRadar: TechRadarItem[] = SEED_TECH_RADAR;
  private learningPaths: LearningPath[] = SEED_LEARNING_PATHS;
  private wallets: Record<string, CreditWallet> = {};
  private transactions: CreditTransaction[] = [];
  private referrals: Referral[] = [];
  private announcements: SystemAnnouncement[] = SEED_ANNOUNCEMENTS;
  private dismissedAnnouncements: Record<string, string[]> = {};
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        try {
          let parsed: User[] = JSON.parse(storedUsers);
          // 1. Strictly deduplicate users by unique email and remove fake test users
          const seenEmails = new Set<string>();
          const deduped: User[] = [];
          
          for (const u of parsed) {
            const cleanEmail = (u.email || '').toLowerCase().trim();
            const id = u.id || '';
            const name = (u.name || '').toLowerCase();
            if (!cleanEmail || seenEmails.has(cleanEmail)) continue;

            // Purge fake mock accounts
            if (id === 'user_aarav' || cleanEmail.includes('example.com') || name.includes('aarav') || u.username === 'aarav_codes') {
              continue;
            }
            seenEmails.add(cleanEmail);

            let updated = { ...u, email: cleanEmail };
            // ONLY techyogeeknirvana@gmail.com is system Lead Admin
            if (cleanEmail === 'techyogeeknirvana@gmail.com' || u.id === 'user_lead_admin' || u.id === 'user_admin_tygn') {
              updated.id = 'user_lead_admin';
              updated.role = 'ADMIN';
              updated.email = 'techyogeeknirvana@gmail.com';
              updated.name = u.name || 'TechYOGeek Nirvana';
              updated.username = 'techyogeeknirvana';
              updated.referralCode = 'TYGN-ADMIN-LEAD';
              updated.avatar = (u.avatar && !u.avatar.includes('unsplash.com'))
                ? u.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=0284c7&color=fff&bold=true`;
            } else if (cleanEmail === 'ishpreet823@gmail.com' || u.id === 'user_ishpreet') {
              updated.id = 'user_ishpreet';
              updated.name = formatNameFromEmail(cleanEmail, u.name === 'Ishpreet Singh' ? undefined : u.name);
              updated.username = 'ishpreet823';
              if (updated.role !== 'ADMIN') {
                updated.role = 'USER';
              }
              if (updated.avatar && updated.avatar.includes('unsplash.com')) {
                updated.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=0284c7&color=fff&bold=true`;
              }
            } else {
              updated.name = formatNameFromEmail(cleanEmail, updated.name);
              if (updated.avatar && updated.avatar.includes('unsplash.com')) {
                updated.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=0284c7&color=fff&bold=true`;
              }
            }
            deduped.push(updated);
          }

          // Ensure SEED_USERS (like techyogeeknirvana@gmail.com) are in list
          for (const seedUser of SEED_USERS) {
            const clean = seedUser.email.toLowerCase().trim();
            if (!seenEmails.has(clean)) {
              seenEmails.add(clean);
              deduped.push(seedUser);
            }
          }

          this.users = deduped;
          this.save(STORAGE_KEYS.USERS, this.users);
        } catch (e) {
          console.error('Error parsing stored users, resetting to seedData:', e);
          this.users = [...SEED_USERS];
          this.save(STORAGE_KEYS.USERS, this.users);
        }
      } else {
        this.users = [...SEED_USERS];
        this.save(STORAGE_KEYS.USERS, this.users);
      }

      const storedOpps = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      if (storedOpps) this.opportunities = JSON.parse(storedOpps);

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) this.events = JSON.parse(storedEvents);

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (storedMessages) this.messages = JSON.parse(storedMessages);

      const storedMoments = localStorage.getItem(STORAGE_KEYS.MOMENTS);
      if (storedMoments) this.moments = JSON.parse(storedMoments);

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) this.projects = JSON.parse(storedProjects);

      const storedQuizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      if (storedQuizzes) this.quizzes = JSON.parse(storedQuizzes);

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (storedLogs) this.auditLogs = JSON.parse(storedLogs);

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (storedReports) this.reports = JSON.parse(storedReports);

      const storedCollab = localStorage.getItem(STORAGE_KEYS.COLLAB);
      if (storedCollab) this.collabRequests = JSON.parse(storedCollab);

      const storedSessions = localStorage.getItem(STORAGE_KEYS.LIVE_SESSIONS);
      if (storedSessions) this.liveSessions = JSON.parse(storedSessions);

      const storedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);
      if (storedWallets) this.wallets = JSON.parse(storedWallets);

      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTx) this.transactions = JSON.parse(storedTx);

      const storedRefs = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      if (storedRefs) this.referrals = JSON.parse(storedRefs);

      const storedAnnouncements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (storedAnnouncements) this.announcements = JSON.parse(storedAnnouncements);

      const storedDismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED_ANNOUNCEMENTS);
      if (storedDismissed) this.dismissedAnnouncements = JSON.parse(storedDismissed);

      // Perform midnight check and auto-reset daily credits across wallets
      this.checkAndResetDailyCredits();

      this.initialized = true;

      // Asynchronously synchronize with SQLite persistent backend
      setTimeout(() => this.syncWithBackend(), 150);
    } catch (e) {
      console.error('Failed to initialize from localStorage', e);
    }
  }

  private syncApi(endpoint: string, method: string, body?: unknown) {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('tygn_session_token');
    let activeUserId = localStorage.getItem('tygn_active_user_id');
    let activeUserEmail = localStorage.getItem('tygn_active_user_email');

    if ((!activeUserId || !activeUserEmail) && typeof window !== 'undefined') {
      try {
        const prof = localStorage.getItem('tygn_user_profile');
        if (prof) {
          const parsed = JSON.parse(prof);
          if (parsed.id && !activeUserId) activeUserId = parsed.id;
          if (parsed.email && !activeUserEmail) activeUserEmail = parsed.email;
        }
      } catch (_) {}
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token && token !== 'tygn_server_session_active') headers['Authorization'] = `Bearer ${token}`;
    if (activeUserId) headers['x-user-id'] = activeUserId;
    if (activeUserEmail) headers['x-user-email'] = activeUserEmail;

    fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    }).catch(err => {
      console.debug(`[store:sync] ${method} ${endpoint} deferred:`, err);
    });
  }

  public async syncWithBackend() {
    if (typeof window === 'undefined') return;
    try {
      const [
        oppsRes,
        pendingOppsRes,
        eventsRes,
        pendingEventsRes,
        annRes,
        momentsRes,
        projRes,
        usersRes,
        collabRes,
        messagesRes
      ] = await Promise.allSettled([
        fetch('/api/opportunities?limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/opportunities?status=pending&limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/events?limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/events?status=pending&limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/announcements').then(r => r.ok ? r.json() : null),
        fetch('/api/moments?includePending=true&limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/projects?includePending=true&limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/users').then(r => r.ok ? r.json() : null),
        fetch('/api/collab?limit=100').then(r => r.ok ? r.json() : null),
        fetch('/api/community?channel=general&limit=100').then(r => r.ok ? r.json() : null),
      ]);

      // Merge opportunities (approved + pending)
      const oppMap = new Map<string, Opportunity>();
      this.opportunities.forEach(o => oppMap.set(o.id, o));
      if (oppsRes.status === 'fulfilled' && oppsRes.value?.data?.length) {
        oppsRes.value.data.forEach((o: Opportunity) => oppMap.set(o.id, o));
      }
      if (pendingOppsRes.status === 'fulfilled' && pendingOppsRes.value?.data?.length) {
        pendingOppsRes.value.data.forEach((o: Opportunity) => oppMap.set(o.id, o));
      }
      this.opportunities = Array.from(oppMap.values());
      this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);

      // Merge events (approved + pending)
      const eventMap = new Map<string, CommunityEvent>();
      this.events.forEach(e => eventMap.set(e.id, e));
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data?.length) {
        eventsRes.value.data.forEach((e: CommunityEvent) => eventMap.set(e.id, e));
      }
      if (pendingEventsRes.status === 'fulfilled' && pendingEventsRes.value?.data?.length) {
        pendingEventsRes.value.data.forEach((e: CommunityEvent) => eventMap.set(e.id, e));
      }
      this.events = Array.from(eventMap.values());
      this.save(STORAGE_KEYS.EVENTS, this.events);

      if (annRes.status === 'fulfilled' && annRes.value?.data?.length) {
        this.announcements = annRes.value.data;
        this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
      }

      // Merge moments
      const momentMap = new Map<string, NirvanaMoment>();
      this.moments.forEach(m => momentMap.set(m.id, m));
      if (momentsRes.status === 'fulfilled' && momentsRes.value?.data?.length) {
        momentsRes.value.data.forEach((m: NirvanaMoment) => momentMap.set(m.id, m));
      }
      this.moments = Array.from(momentMap.values());
      this.save(STORAGE_KEYS.MOMENTS, this.moments);

      // Merge projects
      const projectMap = new Map<string, Project>();
      this.projects.forEach(p => projectMap.set(p.id, p));
      if (projRes.status === 'fulfilled' && projRes.value?.data?.length) {
        projRes.value.data.forEach((p: Project) => projectMap.set(p.id, p));
      }
      this.projects = Array.from(projectMap.values());
      this.save(STORAGE_KEYS.PROJECTS, this.projects);

      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.length) {
        this.setUsers(usersRes.value.data);
      }

      // Merge Collab Requests
      const collabMap = new Map<string, CollabRequest>();
      this.collabRequests.forEach(c => collabMap.set(c.id, c));
      if (collabRes.status === 'fulfilled' && collabRes.value?.data?.length) {
        collabRes.value.data.forEach((c: CollabRequest) => collabMap.set(c.id, c));
      }
      this.collabRequests = Array.from(collabMap.values());
      this.save(STORAGE_KEYS.COLLAB, this.collabRequests);

      // Merge Community Messages
      if (messagesRes.status === 'fulfilled' && messagesRes.value?.data?.messages?.length) {
        const msgMap = new Map<string, CommunityMessage>();
        this.messages.forEach(m => msgMap.set(m.id, m));
        messagesRes.value.data.messages.forEach((m: CommunityMessage) => msgMap.set(m.id, m));
        this.messages = Array.from(msgMap.values());
        this.save(STORAGE_KEYS.MESSAGES, this.messages);
      }

      // Sync active user wallet & token transactions
      const activeUserId = typeof window !== 'undefined' ? localStorage.getItem('tygn_active_user_id') : null;
      if (activeUserId) {
        fetch(`/api/credits?userId=${encodeURIComponent(activeUserId)}`)
          .then(r => r.ok ? r.json() : null)
          .then(json => {
            if (json?.data?.wallet) {
              this.wallets[activeUserId] = json.data.wallet;
              this.save(STORAGE_KEYS.WALLETS, this.wallets);
            }
            if (json?.data?.transactions) {
              this.transactions = json.data.transactions;
              this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.debug('Initial backend sync deferred:', e);
    }
  }

  public setUsers(newUsers: User[]): void {
    const clean = newUsers.filter(u => {
      const email = (u.email || '').toLowerCase().trim();
      const id = u.id || '';
      const name = (u.name || '').toLowerCase();
      if (id === 'user_aarav' || email.includes('example.com') || name.includes('aarav') || u.username === 'aarav_codes') {
        return false;
      }
      return true;
    }).map(u => {
      const cleanEmail = (u.email || '').toLowerCase().trim();
      if (cleanEmail === 'techyogeeknirvana@gmail.com') {
        return {
          ...u,
          id: 'user_lead_admin',
          name: u.name || 'TechYOGeek Nirvana',
          username: 'techyogeeknirvana',
          referralCode: 'TYGN-ADMIN-LEAD',
          role: 'ADMIN' as const,
        };
      }
      return {
        ...u,
        name: formatNameFromEmail(cleanEmail, u.name),
      };
    });

    this.users = clean;
    this.save(STORAGE_KEYS.USERS, this.users);
  }

  private save(key: string, data: unknown) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e);
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    const seen = new Set<string>();
    const result: User[] = [];
    for (const u of this.users) {
      const clean = (u.email || u.id).toLowerCase().trim();
      if (!seen.has(clean)) {
        seen.add(clean);
        result.push(u);
      }
    }
    return result;
  }

  public getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id || u.username === id);
  }

  public updateUser(updated: Partial<User> & { id: string }): User {
    this.users = this.users.map(u => u.id === updated.id ? { ...u, ...updated } : u);
    this.save(STORAGE_KEYS.USERS, this.users);
    return this.getUser(updated.id)!;
  }

  public addUser(newUser: User): User {
    const cleanEmail = (newUser.email || '').toLowerCase().trim();
    const existingIndex = this.users.findIndex(
      u => u.id === newUser.id || (cleanEmail && (u.email || '').toLowerCase().trim() === cleanEmail)
    );

    if (existingIndex > -1) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...newUser };
    } else {
      this.users = [newUser, ...this.users];
    }

    // Deduplicate array
    const seen = new Set<string>();
    this.users = this.users.filter(u => {
      const key = (u.email || u.id).toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    this.save(STORAGE_KEYS.USERS, this.users);
    return newUser;
  }

  public toggleSuspendUser(userId: string, adminUser: User, forcedSuspended?: boolean): boolean {
    const user = this.getUser(userId);
    if (!user) return false;
    user.isSuspended = forcedSuspended !== undefined ? forcedSuspended : !user.isSuspended;
    this.updateUser(user);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: user.isSuspended ? 'SUSPEND_USER' : 'RESTORE_USER',
      targetType: 'user',
      targetId: user.id,
      details: `${user.isSuspended ? 'Suspended' : 'Restored'} user ${user.name} (@${user.username})`,
      status: 'warning'
    });

    return user.isSuspended;
  }

  public changeUserRole(userId: string, newRole: 'USER' | 'ADMIN', adminUser: User): boolean {
    const user = this.getUser(userId);
    if (!user) return false;
    user.role = newRole;
    this.updateUser(user);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'CHANGE_USER_ROLE',
      targetType: 'user',
      targetId: user.id,
      details: `Changed role of ${user.name} to ${newRole}`,
      status: 'warning'
    });

    return true;
  }

  public deleteUser(userId: string, adminUser: User): boolean {
    const user = this.getUser(userId);
    if (!user) return false;

    this.users = this.users.filter(u => u.id !== userId);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.syncApi(`/api/users?targetUserId=${encodeURIComponent(userId)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_USER',
      targetType: 'user',
      targetId: userId,
      details: `Deleted user ${user.name} (${user.email})`,
      status: 'warning'
    });

    return true;
  }

  public adminUpdateUser(targetUserId: string, updates: Partial<User>, adminUser: User): User | null {
    const user = this.getUser(targetUserId);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.updateUser(updated);
    this.syncApi('/api/users', 'PATCH', { action: 'admin_update_user', targetUserId, updates });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_USER',
      targetType: 'user',
      targetId: targetUserId,
      details: `Admin updated details for ${updated.name} (${updated.email})`,
      status: 'success'
    });

    return updated;
  }

  public addXP(userId: string, amount: number) {
    const user = this.getUser(userId);
    if (!user) return;
    user.xp += amount;
    // Level calculation
    if (user.xp >= 10000) user.level = 'Tech Titan';
    else if (user.xp >= 5000) user.level = 'Innovator';
    else if (user.xp >= 2500) user.level = 'Builder';
    else if (user.xp >= 1000) user.level = 'Explorer';
    else user.level = 'Novice';

    this.updateUser(user);
  }

  // --- Opportunities ---
  public getOpportunities(includePending: boolean = false): Opportunity[] {
    if (includePending) return [...this.opportunities];
    return this.opportunities.filter(o => o.status === 'approved');
  }

  public getOpportunity(id: string): Opportunity | undefined {
    return this.opportunities.find(o => o.id === id);
  }

  public setOpportunities(opps: Opportunity[]): void {
    this.opportunities = opps;
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
  }

  public addOpportunity(
    opp: Omit<Opportunity, 'id' | 'createdAt' | 'status' | 'postedBy'>,
    postedBy: User
  ): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: 'opp_' + Date.now(),
      status: 'pending',
      postedBy: {
        id: postedBy.id,
        name: postedBy.name,
        avatar: postedBy.avatar,
        role: postedBy.role
      },
      createdAt: new Date().toISOString()
    };
    this.opportunities.unshift(newOpp);
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.syncApi('/api/opportunities', 'POST', newOpp);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: postedBy.id,
      actorName: postedBy.name,
      actorRole: postedBy.role,
      action: 'SUBMIT_OPPORTUNITY',
      targetType: 'opportunity',
      targetId: newOpp.id,
      details: `Submitted opportunity "${newOpp.title}" at ${newOpp.company} (Status: ${newOpp.status.toUpperCase()})`,
      status: 'success'
    });

    this.addXP(postedBy.id, 50);
    return newOpp;
  }

  public updateOpportunityStatus(
    id: string,
    status: SubmissionStatus,
    adminUser: User,
    rejectionReason?: string
  ): boolean {
    const opp = this.getOpportunity(id);
    if (!opp) return false;

    opp.status = status;
    if (rejectionReason) opp.rejectionReason = rejectionReason;

    this.opportunities = this.opportunities.map(o => o.id === id ? opp : o);
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.syncApi('/api/opportunities', 'PATCH', { id, status, rejectionReason });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: status === 'approved' ? 'APPROVE_OPPORTUNITY' : 'REJECT_OPPORTUNITY',
      targetType: 'opportunity',
      targetId: opp.id,
      details: `${status === 'approved' ? 'Approved' : 'Rejected'} opportunity "${opp.title}" (${opp.company})${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
      status: status === 'approved' ? 'success' : 'warning'
    });

    return true;
  }

  public deleteOpportunity(id: string, adminUser: User): boolean {
    const opp = this.getOpportunity(id);
    if (!opp) return false;

    this.opportunities = this.opportunities.filter(o => o.id !== id);
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.syncApi(`/api/opportunities?id=${encodeURIComponent(id)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_OPPORTUNITY',
      targetType: 'opportunity',
      targetId: id,
      details: `Deleted opportunity "${opp.title}" (${opp.company})`,
      status: 'warning'
    });

    return true;
  }

  public updateOpportunity(updatedOpp: Opportunity, adminUser: User): Opportunity {
    this.opportunities = this.opportunities.map(o => o.id === updatedOpp.id ? updatedOpp : o);
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.syncApi('/api/opportunities', 'PATCH', { id: updatedOpp.id, action: 'modify', updates: updatedOpp });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_OPPORTUNITY',
      targetType: 'opportunity',
      targetId: updatedOpp.id,
      details: `Modified opportunity "${updatedOpp.title}" (${updatedOpp.company})`,
      status: 'success'
    });

    return updatedOpp;
  }

  public toggleSaveOpportunity(oppId: string, userId: string): boolean {
    const opp = this.getOpportunity(oppId);
    if (!opp) return false;
    opp.savedBy = opp.savedBy || [];
    const index = opp.savedBy.indexOf(userId);
    let saved = false;
    if (index > -1) {
      opp.savedBy.splice(index, 1);
      saved = false;
    } else {
      opp.savedBy.push(userId);
      saved = true;
    }
    this.save(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.syncApi('/api/opportunities', 'POST', { action: 'save', opportunityId: oppId });
    return saved;
  }

  // --- Events ---
  public getEvents(includePending: boolean = false): CommunityEvent[] {
    if (includePending) return [...this.events];
    return this.events.filter(e => e.status === 'approved');
  }

  public getEvent(id: string): CommunityEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  public setEvents(events: CommunityEvent[]): void {
    this.events = events;
    this.save(STORAGE_KEYS.EVENTS, this.events);
  }

  public addEvent(
    eventData: Omit<CommunityEvent, 'id' | 'createdAt' | 'status' | 'participantsCount' | 'postedBy'>,
    postedBy: User
  ): CommunityEvent {
    const newEvent: CommunityEvent = {
      ...eventData,
      id: 'event_' + Date.now(),
      participantsCount: 1,
      registeredUsers: [postedBy.id],
      status: 'pending',
      postedBy: {
        id: postedBy.id,
        name: postedBy.name,
        avatar: postedBy.avatar,
        role: postedBy.role
      },
      createdAt: new Date().toISOString()
    };

    this.events.unshift(newEvent);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.syncApi('/api/events', 'POST', newEvent);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: postedBy.id,
      actorName: postedBy.name,
      actorRole: postedBy.role,
      action: 'SUBMIT_EVENT',
      targetType: 'event',
      targetId: newEvent.id,
      details: `Submitted event "${newEvent.title}" (Status: ${newEvent.status.toUpperCase()})`,
      status: 'success'
    });

    this.addXP(postedBy.id, 60);
    return newEvent;
  }

  public updateEventStatus(
    id: string,
    status: SubmissionStatus,
    adminUser: User,
    rejectionReason?: string
  ): boolean {
    const event = this.getEvent(id);
    if (!event) return false;

    event.status = status;
    if (rejectionReason) event.rejectionReason = rejectionReason;

    this.events = this.events.map(e => e.id === id ? event : e);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.syncApi('/api/events', 'PATCH', { id, status, rejectionReason });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: status === 'approved' ? 'APPROVE_EVENT' : 'REJECT_EVENT',
      targetType: 'event',
      targetId: event.id,
      details: `${status === 'approved' ? 'Approved' : 'Rejected'} event "${event.title}"${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
      status: status === 'approved' ? 'success' : 'warning'
    });

    return true;
  }

  public deleteEvent(id: string, adminUser: User): boolean {
    const event = this.getEvent(id);
    if (!event) return false;

    this.events = this.events.filter(e => e.id !== id);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.syncApi(`/api/events?id=${encodeURIComponent(id)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_EVENT',
      targetType: 'event',
      targetId: id,
      details: `Deleted event "${event.title}"`,
      status: 'warning'
    });

    return true;
  }

  public updateEvent(updatedEvent: CommunityEvent, adminUser: User): CommunityEvent {
    this.events = this.events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.syncApi('/api/events', 'PATCH', { id: updatedEvent.id, action: 'modify', updates: updatedEvent });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_EVENT',
      targetType: 'event',
      targetId: updatedEvent.id,
      details: `Modified event "${updatedEvent.title}"`,
      status: 'success'
    });

    return updatedEvent;
  }

  public toggleRegisterEvent(eventId: string, userId: string): boolean {
    const event = this.getEvent(eventId);
    if (!event) return false;
    event.registeredUsers = event.registeredUsers || [];
    const idx = event.registeredUsers.indexOf(userId);
    let registered = false;
    if (idx > -1) {
      event.registeredUsers.splice(idx, 1);
      event.participantsCount = Math.max(0, event.participantsCount - 1);
      registered = false;
    } else {
      event.registeredUsers.push(userId);
      event.participantsCount += 1;
      registered = true;
      this.addXP(userId, 40);
    }
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.syncApi('/api/events', 'POST', { action: 'rsvp', eventId });
    return registered;
  }

  // --- Community Channels & Messages ---
  public getChannels(): CommunityChannel[] {
    return [...this.channels];
  }

  public getMessages(channelSlug: string): CommunityMessage[] {
    return this.messages.filter(m => m.channelSlug === channelSlug);
  }

  public sendMessage(msgData: Omit<CommunityMessage, 'id' | 'timestamp' | 'reactions'>): CommunityMessage {
    const newMsg: CommunityMessage = {
      ...msgData,
      id: 'msg_' + Date.now(),
      timestamp: 'Just now',
      reactions: {}
    };
    this.messages.push(newMsg);
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    this.syncApi('/api/community', 'POST', { id: newMsg.id, channelSlug: newMsg.channelSlug, content: newMsg.content });
    this.addXP(msgData.userId, 10);
    return newMsg;
  }

  public addMessage(msgData: Omit<CommunityMessage, 'id' | 'timestamp' | 'reactions'>): CommunityMessage {
    return this.sendMessage(msgData);
  }

  public mergeMessages(incoming: CommunityMessage[]): void {
    if (!incoming || incoming.length === 0) return;
    const msgMap = new Map<string, CommunityMessage>();
    this.messages.forEach(m => msgMap.set(m.id, m));
    incoming.forEach(m => msgMap.set(m.id, m));
    this.messages = Array.from(msgMap.values());
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
  }

  public toggleReaction(msgId: string, emoji: string, userId: string) {
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg) return;

    if (!msg.reactions[emoji]) {
      msg.reactions[emoji] = [userId];
    } else {
      const idx = msg.reactions[emoji].indexOf(userId);
      if (idx > -1) {
        msg.reactions[emoji].splice(idx, 1);
        if (msg.reactions[emoji].length === 0) {
          delete msg.reactions[emoji];
        }
      } else {
        msg.reactions[emoji].push(userId);
      }
    }
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    this.syncApi('/api/community', 'POST', { action: 'reaction', messageId: msgId, emoji, userId });
  }

  public deleteMessage(msgId: string, adminUser: User): boolean {
    this.messages = this.messages.filter(m => m.id !== msgId);
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    this.syncApi(`/api/community?messageId=${encodeURIComponent(msgId)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_MESSAGE',
      targetType: 'message',
      targetId: msgId,
      details: `Moderator deleted community message ${msgId}`,
      status: 'warning'
    });

    return true;
  }

  public editMessageContent(msgId: string, content: string, adminUser: User): boolean {
    const msg = this.messages.find(m => m.id === msgId);
    if (!msg) return false;
    msg.content = content.trim();
    this.messages = this.messages.map(m => m.id === msgId ? { ...m, content: msg.content } : m);
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    this.syncApi('/api/community', 'PATCH', { messageId: msgId, content: msg.content });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_MESSAGE',
      targetType: 'message',
      targetId: msgId,
      details: `Admin edited message ${msgId}`,
      status: 'success'
    });

    return true;
  }

  // --- Nirvana Moments ---
  public getMoments(includePending: boolean = false, authorId?: string): NirvanaMoment[] {
    if (includePending) return [...this.moments];
    return this.moments.filter(m => {
      const status = m.status || 'approved';
      if (status === 'approved') return true;
      if (authorId && m.userId === authorId) return true;
      return false;
    });
  }

  public setMoments(moments: NirvanaMoment[]): void {
    this.moments = moments;
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
  }

  public addMoment(
    momentData: Omit<NirvanaMoment, 'id' | 'createdAt' | 'likesCount' | 'likedBy' | 'comments' | 'userId' | 'userName' | 'userAvatar' | 'userTitle' | 'status' | 'rejectionReason'>,
    author: User
  ): NirvanaMoment {
    const status: SubmissionStatus = 'approved';
    const newMoment: NirvanaMoment = {
      ...momentData,
      id: 'moment_' + Date.now(),
      userId: author.id,
      userName: author.name,
      userAvatar: author.avatar,
      userTitle: author.title,
      likesCount: 1,
      likedBy: [author.id],
      comments: [],
      status,
      createdAt: 'Just now'
    };
    this.moments.unshift(newMoment);
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi('/api/moments', 'POST', newMoment);
    return newMoment;
  }

  public updateMomentStatus(id: string, status: SubmissionStatus, reviewer: User, reason?: string): boolean {
    const m = this.moments.find(item => item.id === id);
    if (!m) return false;
    m.status = status;
    m.rejectionReason = reason;
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi('/api/moments', 'PATCH', { id, status, rejectionReason: reason });
    if (status === 'approved') {
      this.addXP(m.userId, 45);
    }
    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: reviewer.id,
      actorName: reviewer.name,
      actorRole: reviewer.role,
      action: status === 'approved' ? 'APPROVE_MOMENT' : 'REJECT_MOMENT',
      targetType: 'moment',
      targetId: id,
      details: `${status === 'approved' ? 'Approved' : 'Rejected'} community moment post by ${m.userName}${reason ? ` (${reason})` : ''}`,
      status: 'success'
    });
    return true;
  }

  public deleteMoment(id: string, adminUser: User): boolean {
    const m = this.moments.find(item => item.id === id);
    if (!m) return false;

    this.moments = this.moments.filter(item => item.id !== id);
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi(`/api/moments?id=${encodeURIComponent(id)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_MOMENT',
      targetType: 'moment',
      targetId: id,
      details: `Deleted moment by ${m.userName}`,
      status: 'warning'
    });

    return true;
  }

  public updateMoment(updatedMoment: NirvanaMoment, adminUser: User): NirvanaMoment {
    this.moments = this.moments.map(m => m.id === updatedMoment.id ? updatedMoment : m);
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi('/api/moments', 'PATCH', { id: updatedMoment.id, action: 'modify', updates: updatedMoment });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_MOMENT',
      targetType: 'moment',
      targetId: updatedMoment.id,
      details: `Modified moment by ${updatedMoment.userName}`,
      status: 'success'
    });

    return updatedMoment;
  }

  public toggleLikeMoment(momentId: string, userId: string): boolean {
    const m = this.moments.find(item => item.id === momentId);
    if (!m) return false;
    const idx = m.likedBy.indexOf(userId);
    let liked = false;
    if (idx > -1) {
      m.likedBy.splice(idx, 1);
      m.likesCount = Math.max(0, m.likesCount - 1);
      liked = false;
    } else {
      m.likedBy.push(userId);
      m.likesCount += 1;
      liked = true;
    }
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi('/api/moments', 'POST', { action: 'like', momentId });
    return liked;
  }

  public addCommentMoment(momentId: string, content: string, user: User) {
    const m = this.moments.find(item => item.id === momentId);
    if (!m) return;
    m.comments.push({
      id: 'comment_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: 'Just now'
    });
    this.save(STORAGE_KEYS.MOMENTS, this.moments);
    this.syncApi('/api/moments', 'POST', { action: 'comment', momentId, content });
    this.addXP(user.id, 15);
  }

  // --- Projects ---
  public getProjects(includePending: boolean = false, authorId?: string): Project[] {
    if (includePending) return [...this.projects];
    return this.projects.filter(p => {
      const approval = p.approvalStatus || 'approved';
      if (approval === 'approved') return true;
      if (authorId && p.authorId === authorId) return true;
      return false;
    });
  }

  public setProjects(projects: Project[]): void {
    this.projects = projects;
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
  }

  public addProject(
    projData: Omit<Project, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'authorId' | 'authorName' | 'authorAvatar' | 'approvalStatus' | 'rejectionReason'>,
    author: User
  ): Project {
    const approvalStatus: SubmissionStatus = 'approved';
    const newProj: Project = {
      ...projData,
      id: 'proj_' + Date.now(),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      likes: 1,
      likedBy: [author.id],
      approvalStatus,
      createdAt: new Date().toISOString()
    };
    this.projects.unshift(newProj);
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.syncApi('/api/projects', 'POST', newProj);
    return newProj;
  }

  public updateProjectStatus(id: string, status: SubmissionStatus, reviewer: User, reason?: string): boolean {
    const p = this.projects.find(item => item.id === id);
    if (!p) return false;
    p.approvalStatus = status;
    p.rejectionReason = reason;
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.syncApi('/api/projects', 'PATCH', { id, status, rejectionReason: reason });
    if (status === 'approved') {
      this.addXP(p.authorId, 75);
    }
    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: reviewer.id,
      actorName: reviewer.name,
      actorRole: reviewer.role,
      action: status === 'approved' ? 'APPROVE_PROJECT' : 'REJECT_PROJECT',
      targetType: 'project',
      targetId: id,
      details: `${status === 'approved' ? 'Approved' : 'Rejected'} project submission "${p.title}" by ${p.authorName}${reason ? ` (${reason})` : ''}`,
      status: 'success'
    });
    return true;
  }

  public deleteProject(id: string, adminUser: User): boolean {
    const p = this.projects.find(item => item.id === id);
    if (!p) return false;

    this.projects = this.projects.filter(item => item.id !== id);
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.syncApi(`/api/projects?id=${encodeURIComponent(id)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_PROJECT',
      targetType: 'project',
      targetId: id,
      details: `Deleted project "${p.title}"`,
      status: 'warning'
    });

    return true;
  }

  public updateProject(updatedProject: Project, adminUser: User): Project {
    this.projects = this.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.syncApi('/api/projects', 'PATCH', { id: updatedProject.id, action: 'modify', updates: updatedProject });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_PROJECT',
      targetType: 'project',
      targetId: updatedProject.id,
      details: `Modified project "${updatedProject.title}"`,
      status: 'success'
    });

    return updatedProject;
  }

  public toggleLikeProject(projectId: string, userId: string): boolean {
    const p = this.projects.find(item => item.id === projectId);
    if (!p) return false;
    const idx = p.likedBy.indexOf(userId);
    let liked = false;
    if (idx > -1) {
      p.likedBy.splice(idx, 1);
      p.likes = Math.max(0, p.likes - 1);
      liked = false;
    } else {
      p.likedBy.push(userId);
      p.likes += 1;
      liked = true;
    }
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.syncApi('/api/projects', 'POST', { action: 'like', projectId });
    return liked;
  }

  // --- Quizzes & Live Sessions ---
  public getQuizzes(): Quiz[] {
    return [...this.quizzes];
  }

  public getQuiz(id: string): Quiz | undefined {
    return this.quizzes.find(q => q.id === id);
  }

  public addQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'playsCount'>, author: User): Quiz {
    const newQuiz: Quiz = {
      ...quizData,
      id: 'quiz_' + Date.now(),
      createdAt: new Date().toISOString(),
      playsCount: 0
    };
    this.quizzes.unshift(newQuiz);
    this.save(STORAGE_KEYS.QUIZZES, this.quizzes);
    this.addXP(author.id, 60);
    return newQuiz;
  }

  // Nirvana Live Engine
  public createLiveSession(quiz: Quiz, host?: User, preferredCode?: string): LiveSession {
    // Use preferredCode if given (e.g. from URL/session param) or generate 6-digit numeric PIN
    const code = preferredCode && /^\d{6}$/.test(preferredCode.trim())
      ? preferredCode.trim()
      : Math.floor(100000 + Math.random() * 900000).toString();

    const effectiveHost = host || {
      id: 'u_host_' + Date.now(),
      name: 'Nirvana Host',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      username: 'host',
      email: 'host@tygn.dev',
      role: 'USER' as const,
      title: 'Live Presenter',
      collegeOrCompany: 'Techyogeek Nirvana Community',
      education: '',
      skills: [],
      interests: [],
      xp: 100,
      level: 'Novice',
      badges: [],
      bio: '',
      experienceLevel: 'Beginner' as const,
      isSuspended: false,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };

    const session: LiveSession = {
      id: 'session_' + Date.now(),
      code,
      quiz,
      hostId: effectiveHost.id,
      hostName: effectiveHost.name,
      status: 'lobby',
      currentSlideIndex: 0,
      participants: [
        {
          id: 'p_host',
          nickname: effectiveHost.name + ' (Host)',
          avatar: effectiveHost.avatar,
          score: 0,
          streak: 0,
          joinedAt: new Date().toISOString()
        }
      ],
      responses: [],
      createdAt: new Date().toISOString()
    };

    this.liveSessions[code] = session;
    this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);
    // Sync with backend API
    this.syncApi('/api/live', 'POST', { action: 'create', session });
    return session;
  }

  public async createLiveSessionAsync(quiz: Quiz, host?: User, preferredCode?: string): Promise<LiveSession> {
    const session = this.createLiveSession(quiz, host, preferredCode);
    try {
      await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', session })
      });
    } catch (e) {
      console.warn('Async session sync deferred:', e);
    }
    return session;
  }

  public getLiveSessionByCode(code: string): LiveSession | undefined {
    if (!code) return undefined;
    const clean = code.trim().replace(/\s+/g, '');
    if (this.liveSessions[clean]) return this.liveSessions[clean];

    // Re-check localStorage dynamically if not yet in memory
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LIVE_SESSIONS);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.liveSessions = { ...this.liveSessions, ...parsed };
          if (this.liveSessions[clean]) return this.liveSessions[clean];
        }
      } catch (e) {}
    }

    // Dynamic fallback for standard demo PINs
    if (clean === '447161' || clean === '749201') {
      const matchedQuiz = clean === '749201' ? (this.quizzes[1] || this.quizzes[0]) : this.quizzes[0];
      const fallbackSession: LiveSession = {
        id: 'sess_' + clean,
        code: clean,
        quiz: matchedQuiz,
        hostId: 'user_lead_admin',
        hostName: 'TechYOGeek Nirvana (Host)',
        status: 'lobby',
        currentSlideIndex: 0,
        participants: [
          {
            id: 'p_host',
            nickname: 'TechYOGeek Nirvana (Host)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            score: 0,
            streak: 0,
            joinedAt: new Date().toISOString()
          }
        ],
        responses: [],
        createdAt: new Date().toISOString()
      };
      this.liveSessions[clean] = fallbackSession;
      return fallbackSession;
    }

    return undefined;
  }

  public async getLiveSessionByCodeAsync(code: string): Promise<LiveSession | undefined> {
    if (!code) return undefined;
    const clean = code.trim().replace(/\s+/g, '');
    const local = this.getLiveSessionByCode(clean);

    if (typeof window === 'undefined') return local;

    try {
      const res = await fetch(`/api/live?code=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          this.liveSessions[clean] = json.data;
          this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Live session fetch error:', e);
    }
    return local || this.getLiveSessionByCode(clean);
  }

  public async getActiveLiveSessionsAsync(): Promise<LiveSession[]> {
    if (typeof window === 'undefined') return [];
    try {
      const res = await fetch('/api/live?list=active');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          json.data.forEach((s: LiveSession) => {
            if (s.code) this.liveSessions[s.code] = s;
          });
          return json.data;
        }
      }
    } catch (e) {}

    const demo1 = this.getLiveSessionByCode('447161');
    const demo2 = this.getLiveSessionByCode('749201');
    return [demo1, demo2].filter(Boolean) as LiveSession[];
  }

  public joinLiveSession(code: string, nickname: string, avatar?: string): { success: boolean; participant?: LiveParticipant; message?: string } {
    const clean = code.trim().replace(/\s+/g, '');
    const session = this.getLiveSessionByCode(clean);
    if (!session) return { success: false, message: 'Invalid session code. Please verify the 6-digit PIN.' };
    if (session.status === 'ended') return { success: false, message: 'This live session has concluded.' };

    const participant: LiveParticipant = {
      id: 'part_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      nickname: nickname.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`,
      score: 0,
      streak: 0,
      joinedAt: new Date().toISOString()
    };

    session.participants.push(participant);
    this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);
    // Background sync
    this.syncApi('/api/live', 'POST', { action: 'join', code: clean, participant });
    return { success: true, participant };
  }

  public async joinLiveSessionAsync(code: string, nickname: string, avatar?: string): Promise<{ success: boolean; participant?: LiveParticipant; message?: string }> {
    const clean = code.trim().replace(/\s+/g, '');
    let session = await this.getLiveSessionByCodeAsync(clean);

    // Give a brief retry in case the presenter just created the session moments ago
    if (!session) {
      await new Promise(resolve => setTimeout(resolve, 350));
      session = await this.getLiveSessionByCodeAsync(clean);
    }

    if (!session) return { success: false, message: 'Invalid session code. Please verify the 6-digit PIN.' };
    if (session.status === 'ended') return { success: false, message: 'This live session has concluded.' };

    const participant: LiveParticipant = {
      id: 'part_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      nickname: nickname.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`,
      score: 0,
      streak: 0,
      joinedAt: new Date().toISOString()
    };

    const existing = session.participants.find(p => p.nickname.toLowerCase() === participant.nickname.toLowerCase());
    if (existing) {
      return { success: true, participant: existing };
    }

    session.participants.push(participant);
    this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);

    try {
      const res = await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code: clean, participant })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.participant) {
          return { success: true, participant: json.data.participant };
        }
      }
    } catch (e) {}

    return { success: true, participant };
  }

  public submitLiveAnswer(
    code: string,
    participantId: string,
    selectedOption?: number,
    textResponse?: string,
    timeTaken: number = 5
  ): { isCorrect?: boolean; pointsEarned: number } {
    const clean = code.trim();
    const session = this.getLiveSessionByCode(clean);
    if (!session) return { pointsEarned: 0 };

    const currentSlide = session.quiz.questions[session.currentSlideIndex];
    if (!currentSlide) return { pointsEarned: 0 };

    const participant = session.participants.find(p => p.id === participantId);
    if (!participant) return { pointsEarned: 0 };

    let isCorrect = false;
    let pointsEarned = 0;

    if (currentSlide.type === 'quiz' && currentSlide.correctAnswer !== undefined) {
      isCorrect = selectedOption === currentSlide.correctAnswer;
      if (isCorrect) {
        // Speed bonus calculation
        const timeFraction = Math.max(0.2, (currentSlide.timeLimitSeconds - timeTaken) / currentSlide.timeLimitSeconds);
        const streakBonus = Math.min(500, participant.streak * 100);
        pointsEarned = Math.round(currentSlide.points * timeFraction + streakBonus);
        participant.streak += 1;
        participant.score += pointsEarned;
      } else {
        participant.streak = 0;
      }
    } else {
      // Poll, Word Cloud, etc - grant participation points
      pointsEarned = 250;
      participant.score += pointsEarned;
    }

    const response: LiveResponse = {
      participantId,
      participantNickname: participant.nickname,
      questionId: currentSlide.id,
      slideIndex: session.currentSlideIndex,
      selectedOption,
      textResponse,
      timeTaken,
      isCorrect,
      pointsEarned
    };

    session.responses.push(response);
    this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);

    // Sync answer with server API
    this.syncApi('/api/live', 'POST', {
      action: 'answer',
      code: clean,
      participant: { id: participantId },
      selectedOption,
      textResponse,
      timeTaken
    });

    return { isCorrect, pointsEarned };
  }

  public updateSessionStatus(code: string, status: LiveSession['status'], nextSlideIndex?: number): LiveSession | undefined {
    const clean = code.trim();
    const session = this.getLiveSessionByCode(clean);
    if (!session) return undefined;

    session.status = status;
    if (nextSlideIndex !== undefined) {
      session.currentSlideIndex = nextSlideIndex;
    }
    if (status === 'ended') {
      session.endedAt = new Date().toISOString();
    }
    this.save(STORAGE_KEYS.LIVE_SESSIONS, this.liveSessions);

    // Sync status with server API
    this.syncApi('/api/live', 'POST', {
      action: 'status',
      code: clean,
      status,
      nextSlideIndex
    });

    return session;
  }

  // --- Tech Radar ---
  public getTechRadar(): TechRadarItem[] {
    return [...this.techRadar];
  }

  // --- Collab Finder ---
  public getCollabRequests(): CollabRequest[] {
    return [...this.collabRequests];
  }

  public setCollabRequests(requests: CollabRequest[]): void {
    if (!requests) return;
    const collabMap = new Map<string, CollabRequest>();
    this.collabRequests.forEach(c => collabMap.set(c.id, c));
    requests.forEach(c => collabMap.set(c.id, c));
    this.collabRequests = Array.from(collabMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    this.save(STORAGE_KEYS.COLLAB, this.collabRequests);
  }

  public addCollabRequest(req: Omit<CollabRequest, 'id' | 'createdAt' | 'applicantsCount' | 'status'>, author: User): CollabRequest {
    const newReq: CollabRequest = {
      ...req,
      id: 'collab_' + Date.now(),
      applicantsCount: 0,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    this.collabRequests.unshift(newReq);
    this.save(STORAGE_KEYS.COLLAB, this.collabRequests);
    this.syncApi('/api/collab', 'POST', newReq);
    this.addXP(author.id, 30);
    return newReq;
  }

  // --- Learning Paths ---
  public getLearningPaths(): LearningPath[] {
    return [...this.learningPaths];
  }

  // --- Audit Logs & Reports ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public addAuditLog(log: AuditLog) {
    this.auditLogs.unshift(log);
    this.save(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  public getReports(): ContentReport[] {
    return [...this.reports];
  }

  public submitReport(reportData: Omit<ContentReport, 'id' | 'createdAt' | 'status'>, reporter: User): ContentReport {
    const newRep: ContentReport = {
      ...reportData,
      id: 'rep_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.reports.unshift(newRep);
    this.save(STORAGE_KEYS.REPORTS, this.reports);
    return newRep;
  }

  public updateReportStatus(reportId: string, status: 'resolved' | 'dismissed', adminUser: User): boolean {
    const rep = this.reports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    this.save(STORAGE_KEYS.REPORTS, this.reports);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'RESOLVE_REPORT',
      targetType: rep.targetType,
      targetId: rep.targetId,
      details: `Admin marked report on "${rep.targetTitle}" as ${status.toUpperCase()}`,
      status: 'success'
    });

    return true;
  }

  // ==========================================
  // --- DUAL-LEDGER CREDIT WALLET SYSTEM ---
  // ==========================================

  public getTodayDateString(): string {
    if (typeof window !== 'undefined') {
      return new Date().toLocaleDateString('en-CA');
    }
    return new Date().toISOString().split('T')[0];
  }

  public getWallet(userId: string, clientDate?: string): CreditWallet {
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) ? clientDate : this.getTodayDateString();
    let wallet = this.wallets[userId];

    if (!wallet) {
      wallet = {
        userId,
        dailyCredits: DAILY_DEFAULT_ALLOWANCE,
        referralCredits: 0,
        purchasedCredits: 0,
        totalCredits: DAILY_DEFAULT_ALLOWANCE,
        lastDailyReset: today,
      };
      this.wallets[userId] = wallet;
      this.save(STORAGE_KEYS.WALLETS, this.wallets);
      return { ...wallet };
    }

    // If day changed since last reset, zero old daily pool and grant fresh 10
    if (wallet.lastDailyReset !== today) {
      wallet.dailyCredits = DAILY_DEFAULT_ALLOWANCE;
      wallet.totalCredits = DAILY_DEFAULT_ALLOWANCE + (wallet.referralCredits || 0) + (wallet.purchasedCredits || 0);
      wallet.lastDailyReset = today;
      this.wallets[userId] = wallet;
      this.save(STORAGE_KEYS.WALLETS, this.wallets);
    }

    return { ...wallet };
  }

  public setWallet(wallet: CreditWallet): void {
    this.wallets[wallet.userId] = { ...wallet };
    this.save(STORAGE_KEYS.WALLETS, this.wallets);
  }

  public checkAndResetDailyCredits(force = false, clientDate?: string): void {
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) ? clientDate : this.getTodayDateString();
    let hasChanges = false;

    Object.keys(this.wallets).forEach((uid) => {
      const w = this.wallets[uid];
      if (force || w.lastDailyReset !== today) {
        w.dailyCredits = DAILY_DEFAULT_ALLOWANCE;
        w.totalCredits = DAILY_DEFAULT_ALLOWANCE + (w.referralCredits || 0) + (w.purchasedCredits || 0);
        w.lastDailyReset = today;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.save(STORAGE_KEYS.WALLETS, this.wallets);
    }
  }

  public deductCredits(
    userId: string,
    amount: number,
    description: string,
    feature?: 'chat' | 'resume' | 'admin' | 'system' | 'referral' | 'purchase'
  ): { success: boolean; wallet?: CreditWallet; error?: string } {
    const wallet = this.getWallet(userId);

    if (wallet.totalCredits < amount) {
      return {
        success: false,
        error: `Insufficient balance. You need ${amount} credits, but you have ${wallet.totalCredits} remaining.`,
      };
    }

    // Deduction priority: 1) dailyCredits -> 2) referralCredits -> 3) purchasedCredits
    let remainingToDeduct = amount;

    const fromDaily = Math.min(wallet.dailyCredits, remainingToDeduct);
    wallet.dailyCredits -= fromDaily;
    remainingToDeduct -= fromDaily;

    if (remainingToDeduct > 0) {
      const fromRef = Math.min(wallet.referralCredits, remainingToDeduct);
      wallet.referralCredits -= fromRef;
      remainingToDeduct -= fromRef;
    }

    if (remainingToDeduct > 0) {
      wallet.purchasedCredits -= remainingToDeduct;
      remainingToDeduct = 0;
    }

    wallet.totalCredits = wallet.dailyCredits + wallet.referralCredits + wallet.purchasedCredits;
    this.wallets[userId] = wallet;
    this.save(STORAGE_KEYS.WALLETS, this.wallets);

    const tx: CreditTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      amount: -amount,
      type: 'DEDUCTION',
      feature: feature || 'system',
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: wallet.totalCredits,
    };

    this.transactions.unshift(tx);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    this.syncApi('/api/credits', 'POST', { action: 'deduct', userId, amount, feature, description });

    return { success: true, wallet: { ...wallet } };
  }

  public adjustCreditsAdmin(
    userId: string,
    deltaDaily: number,
    deltaPersistent: number,
    reason: string,
    adminUser: User
  ): CreditWallet {
    const wallet = this.getWallet(userId);

    wallet.dailyCredits = Math.max(0, wallet.dailyCredits + deltaDaily);
    wallet.purchasedCredits = Math.max(0, wallet.purchasedCredits + deltaPersistent);
    wallet.totalCredits = wallet.dailyCredits + wallet.referralCredits + wallet.purchasedCredits;

    this.wallets[userId] = wallet;
    this.save(STORAGE_KEYS.WALLETS, this.wallets);

    const tx: CreditTransaction = {
      id: 'tx_' + Date.now(),
      userId,
      amount: deltaDaily + deltaPersistent,
      type: 'ADMIN_ADJUST',
      feature: 'admin',
      description: `Admin adjustment (${reason}): Daily ${deltaDaily >= 0 ? '+' : ''}${deltaDaily}, Persistent ${deltaPersistent >= 0 ? '+' : ''}${deltaPersistent}`,
      timestamp: new Date().toISOString(),
      balanceAfter: wallet.totalCredits,
    };

    this.transactions.unshift(tx);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    this.syncApi('/api/credits', 'POST', { action: 'adjust', userId, deltaDaily, deltaPersistent, reason });

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'ADMIN_CREDIT_ADJUST' as any,
      targetType: 'user',
      targetId: userId,
      details: `Admin adjusted credits for user ${userId}: Daily ${deltaDaily}, Persistent ${deltaPersistent} (${reason})`,
      status: 'warning',
    });

    return { ...wallet };
  }

  public getTransactions(userId?: string): CreditTransaction[] {
    if (userId) {
      return this.transactions.filter((t) => t.userId === userId);
    }
    return [...this.transactions];
  }

  // ==========================================
  // --- REFERRAL ENGINE ---
  // ==========================================

  public generateReferralCode(username: string): string {
    const clean = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TYGN-${clean || 'JOIN'}-${rand}`;
  }

  public processReferral(newUserId: string, referralCode: string, newUserEmail: string): boolean {
    if (!referralCode || !newUserId) return false;
    const cleanCode = referralCode.trim().toUpperCase();

    // Check if referral already recorded for this user
    if (this.referrals.some((r) => r.referredUserId === newUserId)) {
      return false;
    }

    const referrer = this.users.find(
      (u) =>
        (u.referralCode && u.referralCode.toUpperCase() === cleanCode) ||
        (u.referralCode && `TYGN-${cleanCode}` === u.referralCode.toUpperCase()) ||
        u.username.toUpperCase() === cleanCode ||
        u.email.toUpperCase() === cleanCode ||
        u.id === cleanCode
    );

    if (!referrer || referrer.id === newUserId) {
      return false;
    }

    // Award 10 persistent referral credits to referrer
    const refWallet = this.getWallet(referrer.id);
    refWallet.referralCredits += REFERRAL_BONUS_CREDITS;
    refWallet.totalCredits = refWallet.dailyCredits + refWallet.referralCredits + refWallet.purchasedCredits;
    this.wallets[referrer.id] = refWallet;
    this.save(STORAGE_KEYS.WALLETS, this.wallets);

    const refRecord: Referral = {
      id: 'ref_' + Date.now(),
      referrerId: referrer.id,
      referredUserId: newUserId,
      referredEmail: newUserEmail,
      referralCode: cleanCode,
      creditsAwarded: REFERRAL_BONUS_CREDITS,
      createdAt: new Date().toISOString(),
    };
    this.referrals.unshift(refRecord);
    this.save(STORAGE_KEYS.REFERRALS, this.referrals);

    // Record credit transaction for referrer
    const tx: CreditTransaction = {
      id: 'tx_ref_' + Date.now(),
      userId: referrer.id,
      amount: REFERRAL_BONUS_CREDITS,
      type: 'REFERRAL_BONUS',
      feature: 'referral',
      description: `Referral bonus for inviting ${newUserEmail}`,
      timestamp: new Date().toISOString(),
      balanceAfter: refWallet.totalCredits,
    };
    this.transactions.unshift(tx);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);

    // Award 10 welcome referral credits to new user
    const newWallet = this.getWallet(newUserId);
    newWallet.referralCredits += REFERRAL_BONUS_CREDITS;
    newWallet.totalCredits = newWallet.dailyCredits + newWallet.referralCredits + newWallet.purchasedCredits;
    this.wallets[newUserId] = newWallet;
    this.save(STORAGE_KEYS.WALLETS, this.wallets);

    // Increment referrer's count
    referrer.referralCount = (referrer.referralCount || 0) + 1;
    this.updateUser(referrer);

    // Attach referrer to new user
    const newUser = this.getUser(newUserId);
    if (newUser) {
      newUser.referredBy = referrer.id;
      this.updateUser(newUser);
    }

    return true;
  }

  public getReferrals(referrerId?: string): Referral[] {
    if (referrerId) {
      return this.referrals.filter((r) => r.referrerId === referrerId);
    }
    return [...this.referrals];
  }

  // ==========================================
  // --- SYSTEM BROADCASTS & ANNOUNCEMENTS ---
  // ==========================================

  public getAnnouncements(): SystemAnnouncement[] {
    return [...this.announcements];
  }

  public getActiveAnnouncements(userRole: UserRole = 'USER'): SystemAnnouncement[] {
    const now = new Date().getTime();
    return this.announcements.filter((a) => {
      if (!a.active) return false;
      if (a.expiresAt && new Date(a.expiresAt).getTime() < now) return false;
      if (a.targetAudience === 'ALL') return true;
      if (a.targetAudience === 'ADMINS' && userRole === 'ADMIN') return true;
      if (a.targetAudience === 'USERS' && userRole === 'USER') return true;
      return false;
    });
  }

  public createAnnouncement(
    title: string,
    message: string,
    targetAudience: 'ALL' | 'USERS' | 'ADMINS',
    adminUser: User,
    badge?: string,
    expiresAt?: string
  ): SystemAnnouncement {
    const newAnn: SystemAnnouncement = {
      id: 'ann_' + Date.now(),
      title,
      message,
      targetAudience,
      createdAt: new Date().toISOString(),
      expiresAt,
      createdBy: adminUser.name,
      active: true,
      badge: badge || 'ADMIN BROADCAST',
    };

    this.announcements.unshift(newAnn);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    this.syncApi('/api/announcements', 'POST', newAnn);

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'CREATE_ANNOUNCEMENT' as any,
      targetType: 'system',
      targetId: newAnn.id,
      details: `Created announcement "${title}" targeting ${targetAudience}`,
      status: 'success',
    });

    return newAnn;
  }

  public deleteAnnouncement(id: string, adminUser: User): boolean {
    const found = this.announcements.find((a) => a.id === id);
    if (!found) return false;
    this.announcements = this.announcements.filter((a) => a.id !== id);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    this.syncApi(`/api/announcements?id=${encodeURIComponent(id)}`, 'DELETE');

    this.addAuditLog({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'DELETE_ANNOUNCEMENT' as any,
      targetType: 'system',
      targetId: id,
      details: `Deleted announcement "${found.title}"`,
      status: 'warning',
    });

    return true;
  }

  public dismissAnnouncement(userId: string, announcementId: string): void {
    if (!userId || !announcementId) return;
    const list = this.dismissedAnnouncements[userId] || [];
    if (!list.includes(announcementId)) {
      this.dismissedAnnouncements[userId] = [...list, announcementId];
      this.save(STORAGE_KEYS.DISMISSED_ANNOUNCEMENTS, this.dismissedAnnouncements);
      this.syncApi('/api/announcements', 'POST', { action: 'dismiss', announcementId });
    }
  }

  public isAnnouncementDismissed(userId: string, announcementId: string): boolean {
    if (!userId || !announcementId) return false;
    const list = this.dismissedAnnouncements[userId] || [];
    return list.includes(announcementId);
  }
}

export const dbStore = new DataStore();
