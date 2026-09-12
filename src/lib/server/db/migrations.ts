import { db } from './client';
import bcrypt from 'bcryptjs';

export async function runMigrations(): Promise<void> {
  // If Postgres is connected, schema is created via supabase_schema.sql.
  // This helper handles local/runtime schema safety.
  try {
    // 1. Ensure all tables exist in SQLite before querying anything
    if (!db.isPostgres()) {
      const { SCHEMA_SQL } = await import('./schema');
      await db.execRaw(SCHEMA_SQL);
    }

    const channelCount = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM community_channels');
    if (!channelCount || Number(channelCount.count) === 0) {
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
        await db.execute(`
          INSERT INTO community_channels (id, slug, name, description, category, icon_name, is_locked, is_announcement, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [ch[0], ch[1], ch[2], ch[3], ch[4], ch[5], ch[6], ch[7], now]);
      }
    }

    // Seed initial users from SEED_USERS
    const { SEED_USERS } = await import('@/lib/db/seedData');
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const defaultPasswordHash = await bcrypt.hash('Admin@TYGN2026!', 10);

    for (const seed of SEED_USERS) {
      const cleanEmail = (seed.email || '').toLowerCase().trim();
      if (!cleanEmail) continue;

      const existing = await db.queryOne('SELECT id FROM users WHERE id = ? OR LOWER(email) = ?', [seed.id, cleanEmail]);
      if (!existing) {
        await db.execute(`
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
        `, [
          seed.id,
          seed.name,
          seed.username,
          cleanEmail,
          defaultPasswordHash,
          seed.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seed.name)}&background=0284c7&color=fff&bold=true`,
          seed.role,
          seed.title || 'Developer & Member',
          seed.collegeOrCompany || 'Techyogeek Nirvana Community',
          seed.education || 'B.Tech / Computer Science',
          JSON.stringify(seed.skills || []),
          JSON.stringify(seed.interests || []),
          seed.github || '',
          seed.linkedin || '',
          seed.experienceLevel || 'Beginner',
          seed.xp || 100,
          seed.level || 'Novice',
          JSON.stringify(seed.badges || []),
          seed.bio || '',
          0,
          1,
          now,
          seed.referralCode || `TYGN-${seed.username.toUpperCase()}`,
          seed.referralCount || 0,
          seed.createdAt || now,
          now
        ]);

        await db.execute(`
          INSERT INTO credit_wallets (
            user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [seed.id, 10, 0, 0, 10, today, now, now]);
      }
    }

    // Seed Quizzes and Questions
    const { SEED_QUIZZES } = await import('@/lib/db/seedData');
    for (const q of SEED_QUIZZES) {
      const existingQuiz = await db.queryOne('SELECT id FROM quizzes WHERE id = ?', [q.id]);
      if (!existingQuiz) {
        await db.execute(`
          INSERT INTO quizzes (id, title, topic, difficulty, description, creator_id, creator_name, plays_count, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [q.id, q.title, q.topic, q.difficulty, q.description, q.creatorId, q.creatorName, q.playsCount || 0, q.createdAt || now]);

        for (let i = 0; i < q.questions.length; i++) {
          const quest = q.questions[i];
          await db.execute(`
            INSERT INTO quiz_questions (id, quiz_id, question_index, question_type, question_text, options, correct_answer, explanation, time_limit_seconds, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            quest.id,
            q.id,
            i,
            quest.type,
            quest.question,
            JSON.stringify(quest.options || []),
            quest.correctAnswer !== undefined ? quest.correctAnswer : null,
            quest.explanation || null,
            quest.timeLimitSeconds || 20,
            quest.points || 1000
          ]);
        }
      }
    }

    // Ensure Public Live Demo Sessions exist and are active in lobby state
    const demoSessions = [
      {
        code: '447161',
        quiz: SEED_QUIZZES[0],
        title: 'Tech & Architecture Live Arena'
      },
      {
        code: '749201',
        quiz: SEED_QUIZZES[1] || SEED_QUIZZES[0],
        title: 'DSA Sprint Live Challenge'
      }
    ];

    for (const demo of demoSessions) {
      const existingSession = await db.queryOne('SELECT id, status FROM live_sessions WHERE code = ?', [demo.code]);
      const sessionObj = {
        id: 'sess_' + demo.code,
        code: demo.code,
        quiz: demo.quiz,
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
            joinedAt: now
          }
        ],
        responses: [],
        createdAt: now
      };

      if (!existingSession) {
        await db.execute(`
          INSERT INTO live_sessions (id, code, quiz_id, host_id, status, current_slide_index, session_data, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          sessionObj.id,
          demo.code,
          demo.quiz.id,
          'user_lead_admin',
          'lobby',
          0,
          JSON.stringify(sessionObj),
          now
        ]);
      } else if (existingSession.status === 'ended') {
        // Revive ended demo session back into lobby so visitors can always join
        await db.execute(`
          UPDATE live_sessions
          SET status = 'lobby', current_slide_index = 0, session_data = ?, ended_at = NULL
          WHERE code = ?
        `, [JSON.stringify(sessionObj), demo.code]);
      }
    }

    // Ensure collab_requests schema compatibility columns
    try {
      await db.execute('ALTER TABLE collab_requests ADD COLUMN applicants_count INTEGER DEFAULT 0');
    } catch (_) {}
    try {
      await db.execute('ALTER TABLE collab_requests ADD COLUMN organizer_name TEXT');
    } catch (_) {}
    try {
      await db.execute('ALTER TABLE collab_requests ADD COLUMN organizer_avatar TEXT');
    } catch (_) {}

    // Seed Collab Requests if table is empty
    const collabCount = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM collab_requests');
    if (!collabCount || Number(collabCount.count) === 0) {
      const { SEED_COLLAB_REQUESTS } = await import('@/lib/db/seedData');
      for (const req of SEED_COLLAB_REQUESTS) {
        await db.execute(`
          INSERT INTO collab_requests (
            id, title, organizer_id, organizer_name, organizer_avatar, organizer_role,
            hackathon_or_project, role_needed, required_skills, description, deadline,
            status, applicants_count, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          req.id,
          req.title,
          req.organizerId || 'user_lead_admin',
          req.organizerName || 'TechYOGeek Nirvana',
          req.organizerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          req.organizerRole || 'Lead Platform Architect',
          req.hackathonOrProject,
          req.roleNeeded,
          JSON.stringify(req.requiredSkills || []),
          req.description,
          req.deadline,
          req.status || 'open',
          req.applicantsCount || 0,
          req.createdAt || now
        ]);
      }
    }

    // Ensure all existing community posts have approved status so all accounts see them
    try {
      await db.execute("UPDATE nirvana_moments SET status = 'approved' WHERE status = 'pending' OR status IS NULL");
      await db.execute("UPDATE projects SET approval_status = 'approved' WHERE approval_status = 'pending' OR approval_status IS NULL");
      await db.execute("UPDATE community_events SET status = 'approved' WHERE status = 'pending' OR status IS NULL");
      await db.execute("UPDATE opportunities SET status = 'approved' WHERE status = 'pending' OR status IS NULL");
    } catch (_) {}
  } catch (err) {
    console.warn('Migration hook skipped/deferred:', err);
  }
}
