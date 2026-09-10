import { db } from './client';
import bcrypt from 'bcryptjs';

export async function runMigrations(): Promise<void> {
  // If Postgres is connected, schema is created via supabase_schema.sql.
  // This helper handles local/runtime schema safety.
  try {
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
  } catch (err) {
    console.warn('Migration hook skipped/deferred:', err);
  }
}
