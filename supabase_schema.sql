-- ============================================================================
-- TechYOGeek Nirvana (TYGN) — Supabase / PostgreSQL Production Schema
-- 25 Normalized Tables with Constraints, Indexes, and Initial Seed Data
-- ============================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN')),
  title TEXT,
  college_or_company TEXT,
  education TEXT,
  skills TEXT DEFAULT '[]',
  interests TEXT DEFAULT '[]',
  github TEXT,
  linkedin TEXT,
  portfolio TEXT,
  experience_level TEXT DEFAULT 'Beginner',
  xp INTEGER NOT NULL DEFAULT 0,
  level TEXT DEFAULT 'Novice',
  badges TEXT DEFAULT '[]',
  bio TEXT,
  is_suspended INTEGER NOT NULL DEFAULT 0,
  is_email_verified INTEGER NOT NULL DEFAULT 0,
  email_verified_at TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referral_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- 2. User Sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);

-- 3. Dual-Ledger Credit Wallets table
CREATE TABLE IF NOT EXISTS credit_wallets (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_credits INTEGER NOT NULL DEFAULT 10,
  referral_credits INTEGER NOT NULL DEFAULT 0,
  purchased_credits INTEGER NOT NULL DEFAULT 0,
  total_credits INTEGER NOT NULL DEFAULT 10,
  last_daily_reset TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. Credit Transactions Audit Ledger
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('DEDUCTION', 'DAILY_GRANT', 'REFERRAL_BONUS', 'PURCHASE', 'ADMIN_ADJUST')),
  feature TEXT,
  description TEXT NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created ON credit_transactions(created_at);

-- 5. Referrals Tracking
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  credits_awarded INTEGER NOT NULL DEFAULT 10,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

-- 6. Opportunities Marketplace
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  type TEXT NOT NULL CHECK(type IN ('job', 'internship', 'freelance', 'hackathon', 'competition')),
  location TEXT NOT NULL,
  is_remote INTEGER NOT NULL DEFAULT 0,
  experience TEXT,
  stipend_or_salary TEXT,
  skills TEXT DEFAULT '[]',
  description TEXT NOT NULL,
  apply_url TEXT NOT NULL,
  deadline TEXT NOT NULL,
  posted_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('draft', 'pending', 'approved', 'rejected', 'expired')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_opps_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opps_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opps_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opps_created_at ON opportunities(created_at);

-- 7. Saved Opportunities Junction
CREATE TABLE IF NOT EXISTS opportunity_saves (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, opportunity_id)
);

-- 8. Community Events
CREATE TABLE IF NOT EXISTS community_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  organizer TEXT NOT NULL,
  organizer_logo TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  is_online INTEGER NOT NULL DEFAULT 1,
  registration_deadline TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT,
  skills TEXT DEFAULT '[]',
  registration_url TEXT NOT NULL,
  max_participants INTEGER,
  banner_image TEXT,
  posted_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('draft', 'pending', 'approved', 'rejected', 'expired')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON community_events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON community_events(date);

-- 9. Event Registrations (RSVP) Junction
CREATE TABLE IF NOT EXISTS event_registrations (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- 10. Community Channels
CREATE TABLE IF NOT EXISTS community_channels (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon_name TEXT,
  is_locked INTEGER NOT NULL DEFAULT 0,
  is_announcement INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_channels_slug ON community_channels(slug);

-- 11. Community Messages
CREATE TABLE IF NOT EXISTS community_messages (
  id TEXT PRIMARY KEY,
  channel_slug TEXT NOT NULL REFERENCES community_channels(slug) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  code_language TEXT,
  code_snippet TEXT,
  reply_to_id TEXT,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_channel ON community_messages(channel_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user ON community_messages(user_id);

-- 12. Message Reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  message_id TEXT NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji)
);

-- 13. Nirvana Moments (Social Showcase)
CREATE TABLE IF NOT EXISTS nirvana_moments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_moments_created ON nirvana_moments(created_at);
CREATE INDEX IF NOT EXISTS idx_moments_status ON nirvana_moments(status);

-- 14. Moment Likes
CREATE TABLE IF NOT EXISTS moment_likes (
  moment_id TEXT NOT NULL REFERENCES nirvana_moments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (moment_id, user_id)
);

-- 15. Moment Comments
CREATE TABLE IF NOT EXISTS moment_comments (
  id TEXT PRIMARY KEY,
  moment_id TEXT NOT NULL REFERENCES nirvana_moments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moment_comments_moment ON moment_comments(moment_id, created_at);

-- 16. Projects Showcase
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT DEFAULT '[]',
  github_url TEXT NOT NULL,
  live_url TEXT,
  cover_image TEXT,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Progress',
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK(approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_approval ON projects(approval_status);

-- 17. Project Likes
CREATE TABLE IF NOT EXISTS project_likes (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- 18. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plays_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 19. Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT DEFAULT '[]',
  correct_answer INTEGER,
  explanation TEXT,
  time_limit_seconds INTEGER NOT NULL DEFAULT 20,
  points INTEGER NOT NULL DEFAULT 1000
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id, question_index);

-- 20. Live Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
  host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'lobby',
  current_slide_index INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  ended_at TEXT,
  session_data TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_code ON live_sessions(code);

-- 21. System Announcements
CREATE TABLE IF NOT EXISTS system_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'ALL' CHECK(target_audience IN ('ALL', 'USERS', 'ADMINS')),
  badge TEXT DEFAULT 'PLATFORM UPDATE',
  created_by_name TEXT NOT NULL,
  created_by_user_id TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON system_announcements(active, created_at);

-- 22. Dismissed Announcements Junction
CREATE TABLE IF NOT EXISTS dismissed_announcements (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  announcement_id TEXT NOT NULL REFERENCES system_announcements(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, announcement_id)
);

-- 23. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success' CHECK(status IN ('success', 'warning', 'error')),
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 24. Content Moderation Reports
CREATE TABLE IF NOT EXISTS content_reports (
  id TEXT PRIMARY KEY,
  reported_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  resolution_note TEXT,
  resolved_by_user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON content_reports(status);

-- 25. Collab Requests
CREATE TABLE IF NOT EXISTS collab_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organizer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organizer_role TEXT,
  hackathon_or_project TEXT NOT NULL,
  role_needed TEXT NOT NULL,
  required_skills TEXT DEFAULT '[]',
  description TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL
);

-- ============================================================================
-- Initial Seed Data: Community Channels & Platform Lead Admin
-- ============================================================================

INSERT INTO community_channels (id, slug, name, description, category, icon_name, is_locked, is_announcement, created_at)
VALUES 
  ('c1', 'general', 'general', 'Central hub for community chat, updates, and discussions', 'General', 'MessageSquare', 0, 0, NOW()),
  ('c2', 'introductions', 'introductions', 'Say hello, share your background, and connect with fellow members', 'General', 'UserPlus', 0, 0, NOW()),
  ('c3', 'web-development', 'web-development', 'React, Next.js, TypeScript, Node, APIs, and modern web architecture', 'Development', 'Globe', 0, 0, NOW()),
  ('c4', 'ai-ml', 'ai-ml', 'LLMs, PyTorch, autonomous agents, machine learning, and AI systems', 'Development', 'Sparkles', 0, 0, NOW()),
  ('c5', 'cybersecurity', 'cybersecurity', 'CTFs, ethical hacking, appsec, and cryptography', 'Specializations', 'Shield', 0, 0, NOW()),
  ('c6', 'cloud', 'cloud', 'AWS, GCP, Azure, Kubernetes, Docker, and distributed systems', 'Specializations', 'Cloud', 0, 0, NOW()),
  ('c7', 'competitive-programming', 'competitive-programming', 'LeetCode, Codeforces, data structures, and algorithms', 'Coding', 'Code2', 0, 0, NOW()),
  ('c8', 'open-source', 'open-source', 'GSoC, Hacktoberfest, repo collaboration, and OSS contributions', 'Coding', 'GitBranch', 0, 0, NOW()),
  ('c9', 'career', 'career', 'Resume tips, interview prep, referrals, and tech hiring', 'Career', 'Briefcase', 0, 0, NOW()),
  ('c10', 'startups', 'startups', 'Founder discussions, pitch decks, and tech product launches', 'Career', 'Rocket', 0, 0, NOW()),
  ('c11', 'projects', 'projects', 'Show off what you are building, get feedback, and find contributors', 'Community', 'Layers', 0, 0, NOW()),
  ('c12', 'college-community', 'college-community', 'Campus hackathons, student clubs, study groups, and student life', 'Community', 'GraduationCap', 0, 0, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed Lead Admin (techyogeeknirvana@gmail.com) with bcrypt hash for 'Admin@TYGN2026!'
INSERT INTO users (
  id, name, username, email, password_hash, avatar, role, title, college_or_company,
  education, skills, interests, github, linkedin, experience_level, xp, level,
  badges, bio, is_suspended, is_email_verified, email_verified_at, referral_code,
  referral_count, created_at, updated_at
) VALUES (
  'user_lead_admin',
  'TechYOGeek Nirvana',
  'techyogeeknirvana',
  'techyogeeknirvana@gmail.com',
  '$2a$12$RjN.l3K3vFq17h1KjN6dO.eD52e0/G86nU801F4C1cZ8kL3yW8G3q',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'ADMIN',
  'Lead Platform Administrator',
  'TechYOGeek Nirvana Core Team',
  'Computer Science & Engineering',
  '["Full Stack Development","System Architecture","Cybersecurity","Community Leadership"]',
  '["Open Source","Hackathons","Cloud Infrastructure","AI Systems"]',
  'https://github.com/techyogeeknirvana-eng',
  'https://linkedin.com/company/techyogeeknirvana',
  'Advanced',
  10000,
  'Grandmaster',
  '["Founding Member","Platform Architect","Core Contributor"]',
  'Official platform administrative account managing TechYOGeek Nirvana ecosystem.',
  0, 1, NOW(), 'TYGNLEAD2026', 0, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- Seed Admin Wallet with initial credits
INSERT INTO credit_wallets (
  user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
) VALUES (
  'user_lead_admin', 10000, 0, 0, 10000, TO_CHAR(NOW(), 'YYYY-MM-DD'), NOW(), NOW()
) ON CONFLICT (user_id) DO NOTHING;
