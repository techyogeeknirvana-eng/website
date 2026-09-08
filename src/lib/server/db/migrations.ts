import { getDatabase } from './client';
import { SCHEMA_SQL } from './schema';
import bcrypt from 'bcryptjs';

export function runMigrations(): void {
  const db = getDatabase();

  // Execute schema creation
  db.exec(SCHEMA_SQL);

  try {
    db.prepare('ALTER TABLE projects ADD COLUMN deleted_at TEXT').run();
  } catch (_) {}

  // Seed reference channels if none exist
  const channelCount = db.prepare('SELECT COUNT(*) as count FROM community_channels').get() as { count: number };
  if (channelCount.count === 0) {
    const insertChannel = db.prepare(`
      INSERT INTO community_channels (id, slug, name, description, category, icon_name, is_locked, is_announcement, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultChannels = [
      ['c1', 'general', 'general', 'Central hub for community chat, updates, and discussions', 'General', 'MessageSquare', 0, 0],
      ['c2', 'introductions', 'introductions', 'Say hello, share your background, and connect with fellow members', 'General', 'UserPlus', 0, 0],
      ['c3', 'web-development', 'web-development', 'React, Next.js, TypeScript, Node, APIs, and modern web architecture', 'Development', 'Globe', 0, 0],
      ['c4', 'ai-ml', 'ai-ml', 'LLMs, PyTorch, autonomous agents, machine learning, and AI systems', 'Development', 'Sparkles', 0, 0],
      ['c5', 'cybersecurity', 'cybersecurity', 'CTFs, ethical hacking, appsec, and cryptography', 'Specializations', 'Shield', 0, 0],
      ['c6', 'cloud', 'cloud', 'AWS, GCP, Azure, Kubernetes, Docker, and distributed systems', 'Specializations', 'Cloud', 0, 0],
      ['c7', 'competitive-programming', 'competitive-programming', 'LeetCode, Codeforces, data structures, and algorithms', 'Coding', 'Code2', 0, 0],
      ['c8', 'open-source', 'open-source', 'GSoC, Hacktoberfest, repo collaboration, and OSS contributions', 'Coding', 'GitBranch', 0, 0],
      ['c9', 'career', 'career', 'Resume tips, interview prep, referrals, and tech hiring', 'Career', 'Briefcase', 0, 0],
      ['c10', 'startups', 'startups', 'Founder discussions, pitch decks, and tech product launches', 'Career', 'Rocket', 0, 0],
      ['c11', 'projects', 'projects', 'Show off what you are building, get feedback, and find contributors', 'Community', 'Layers', 0, 0],
      ['c12', 'college-community', 'college-community', 'Campus hackathons, student clubs, study groups, and student life', 'Community', 'GraduationCap', 0, 0],
    ];

    const now = new Date().toISOString();
    for (const ch of defaultChannels) {
      insertChannel.run(ch[0], ch[1], ch[2], ch[3], ch[4], ch[5], ch[6], ch[7], now);
    }
  }

  // Seed default admin account if not already in database
  const adminRow = db.prepare('SELECT id FROM users WHERE email = ?').get('techyogeeknirvana@gmail.com');
  if (!adminRow) {
    const adminId = 'user_lead_admin';
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    // Secure default password hash for local dev/admin bootstrap
    const defaultPasswordHash = bcrypt.hashSync('Admin@TYGN2026!', 12);

    db.prepare(`
      INSERT INTO users (
        id, name, username, email, password_hash, avatar, role, title, college_or_company,
        education, skills, interests, github, linkedin, experience_level, xp, level,
        badges, bio, is_suspended, is_email_verified, email_verified_at, referral_code,
        referral_count, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      adminId,
      'TechYOGeek Nirvana',
      'techyogeeknirvana',
      'techyogeeknirvana@gmail.com',
      defaultPasswordHash,
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'ADMIN',
      'Lead Platform Architect & Administrator',
      'Techyogeek Nirvana Core',
      'B.Tech in Computer Science',
      JSON.stringify(['System Architecture', 'TypeScript', 'Next.js', 'Go', 'AI Systems', 'Cloud Native']),
      JSON.stringify(['Developer Tools', 'Open Source', 'Community Building', 'AI Agents']),
      'https://github.com/techyogeek',
      'https://www.linkedin.com/in/techyogeek-nirvana-834b92309/',
      'Tech Titan',
      15400,
      'Tech Titan',
      JSON.stringify(['🏆 Quiz Master', '💻 Developer', '🎤 Event Speaker', '🔥 Community Contributor', '🤖 AI Explorer']),
      'Ishpreet Singh is the platform architect and founder of Techyogeek Nirvana (B.Tech Student Community).',
      0,
      1,
      now,
      'TYGN-ADMIN-LEAD',
      0,
      now,
      now
    );

    // Create wallet for lead admin
    db.prepare(`
      INSERT INTO credit_wallets (
        user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(adminId, 10, 0, 0, 10, today, now, now);
  }

  // Seed Ishpreet admin account if not in database
  const ishpreetRow = db.prepare('SELECT id FROM users WHERE email = ?').get('ishpreet823@gmail.com');
  if (!ishpreetRow) {
    const ishpreetId = 'user_ishpreet';
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const passwordHash = bcrypt.hashSync('Ishpreet@TYGN2026!', 12);

    db.prepare(`
      INSERT INTO users (
        id, name, username, email, password_hash, avatar, role, title, college_or_company,
        education, skills, interests, github, linkedin, experience_level, xp, level,
        badges, bio, is_suspended, is_email_verified, email_verified_at, referral_code,
        referral_count, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      ishpreetId,
      'Ishpreet 823',
      'ishpreet823',
      'ishpreet823@gmail.com',
      passwordHash,
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'USER',
      'Community Member & Developer',
      'Techyogeek Nirvana Core',
      'B.Tech in Computer Science',
      JSON.stringify(['TypeScript', 'React', 'Next.js', 'Python', 'AI Systems']),
      JSON.stringify(['Community Building', 'Hackathons', 'Open Source']),
      'https://github.com/techyogeek',
      'https://www.linkedin.com/in/techyogeek-nirvana-834b92309/',
      'Tech Titan',
      15400,
      'Tech Titan',
      JSON.stringify(['🏆 Quiz Master', '💻 Developer', '🎤 Event Speaker', '🔥 Community Contributor']),
      'Ishpreet Singh is an active member of Techyogeek Nirvana.',
      0,
      1,
      now,
      'TYGN-ISH-777',
      5,
      now,
      now
    );

    db.prepare(`
      INSERT INTO credit_wallets (
        user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ishpreetId, 10, 0, 0, 10, today, now, now);
  }

  // Seed initial opportunity if empty
  const oppCount = db.prepare('SELECT COUNT(*) as count FROM opportunities').get() as { count: number };
  if (oppCount.count === 0) {
    db.prepare(`
      INSERT INTO opportunities (
        id, title, company, company_logo, type, location, is_remote, experience,
        stipend_or_salary, skills, description, apply_url, deadline, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'opp_1',
      'Software Engineering Fellow — Summer 2026',
      'Microsoft',
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80',
      'internship',
      'Bengaluru / Hyderabad, India (Hybrid)',
      0,
      'B.Tech / Dual Degree students graduating 2026/2027',
      '₹1,25,000 / month + Housing',
      JSON.stringify(['TypeScript', 'React', 'Python', 'Data Structures', 'Algorithms', 'System Design']),
      'Join Microsoft engineering teams working on cloud scale, developer productivity, and AI-first consumer tools. Mentorship and PPO opportunities.',
      'https://careers.microsoft.com',
      '2026-10-15',
      'user_lead_admin',
      'approved',
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  // Seed initial event if empty
  const evCount = db.prepare('SELECT COUNT(*) as count FROM community_events').get() as { count: number };
  if (evCount.count === 0) {
    db.prepare(`
      INSERT INTO community_events (
        id, title, category, organizer, organizer_logo, date, time, location,
        is_online, registration_deadline, description, eligibility, skills,
        registration_url, max_participants, banner_image, posted_by_user_id,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'event_1',
      'Nirvana Global Hackathon 2026: Build the Future with AI',
      'Hackathons',
      'Techyogeek Nirvana & Ecosystem Partners',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&auto=format&fit=crop&q=80',
      'March 20 - 22, 2026',
      '48 Hours Continuous',
      'Virtual / Global & Live Stage',
      1,
      '2026-03-18',
      'Join over 3,000 developers building next-generation AI agents. $15,000 prize pool and hiring fast-tracks.',
      'Open to all B.Tech students and developers worldwide.',
      JSON.stringify(['AI/ML', 'Full Stack', 'Product Design', 'Next.js', 'APIs']),
      'https://nirvana.community/hackathon-2026',
      3000,
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      'user_lead_admin',
      'approved',
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  // Seed initial moment if empty
  const momCount = db.prepare('SELECT COUNT(*) as count FROM nirvana_moments').get() as { count: number };
  if (momCount.count === 0) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO nirvana_moments (
        id, user_id, content, category, image_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'approved', ?, ?)
    `).run(
      'moment_1',
      'user_lead_admin',
      '🚀 Techyogeek Nirvana 2.0 is live with real persistent database architecture, dual-ledger daily credit resets, and real-time community chat! Join in and start building!',
      'ProjectLaunch',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      now,
      now
    );
  }


  // Seed initial project if empty
  const projCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projCount.count === 0) {
    db.prepare(`
      INSERT INTO projects (
        id, title, description, tech_stack, github_url, live_url, cover_image,
        author_id, category, status, approval_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)
    `).run(
      'proj_1',
      'GitPulse — Intelligent Code Review Copilot',
      'An automated GitHub Action that inspects PR diffs, detects security vulnerabilities and architectural anti-patterns, and generates benchmark test suites.',
      JSON.stringify(['TypeScript', 'Next.js', 'GitHub API', 'FastAPI', 'PyTorch']),
      'https://github.com/techyogeek/gitpulse',
      'https://gitpulse.dev',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      'user_lead_admin',
      'AI',
      'Beta',
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  // Seed standard welcome announcement if none exist
  const annCount = db.prepare('SELECT COUNT(*) as count FROM system_announcements').get() as { count: number };
  if (annCount.count === 0) {
    db.prepare(`
      INSERT INTO system_announcements (
        id, title, message, target_audience, badge, created_by_name, active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'ann_welcome',
      '🚀 Welcome to Techyogeek Nirvana 2.0!',
      'Every member receives 10 free daily credits each day for community discussions and AI resume evaluations. Invite your peers with your unique referral link to earn 10 permanent credits per signup!',
      'ALL',
      'COMMUNITY ANNOUNCEMENT',
      'System Lead',
      1,
      new Date().toISOString()
    );
  }

  // Seed initial welcome message if messages are empty
  const msgCount = db.prepare('SELECT COUNT(*) as count FROM community_messages').get() as { count: number };
  if (msgCount.count === 0) {
    db.prepare(`
      INSERT INTO community_messages (id, channel_slug, user_id, content, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'msg_welcome',
      'general',
      'user_lead_admin',
      'Welcome to Techyogeek Nirvana (TYGN)! 🚀 Explore our B.Tech Notes Drive, take live interactive quizzes, check out verified internships, and connect with fellow developers.',
      1,
      new Date().toISOString(),
      new Date().toISOString()
    );
  }
}
