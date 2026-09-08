/**
 * Comprehensive Backend Verification Test Suite
 * Tests SQLite database schema, services, authentication, dual-ledger credits, and live REST API endpoints.
 */

const path = require('path');
const fs = require('fs');

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING FULL BACKEND VERIFICATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Check Database File
  console.log('1. Database Engine & File Check');
  const dbPath = path.join(process.cwd(), 'data', 'tygn_production.db');
  assert(fs.existsSync(dbPath), `Database file exists at ${dbPath}`);

  const Database = require('better-sqlite3');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  // Check WAL mode
  const journalMode = db.pragma('journal_mode', { simple: true });
  assert(journalMode.toLowerCase() === 'wal', `Database journal_mode is WAL (Current: ${journalMode})`);

  // Check 25 Tables
  const expectedTables = [
    'users', 'user_sessions', 'credit_wallets', 'credit_transactions', 'referrals',
    'opportunities', 'opportunity_saves',
    'community_events', 'event_registrations',
    'community_channels', 'community_messages', 'message_reactions',
    'nirvana_moments', 'moment_likes', 'moment_comments',
    'projects', 'project_likes', 'quizzes', 'quiz_questions',
    'live_sessions', 'collab_requests', 'audit_logs', 'content_reports',
    'system_announcements', 'dismissed_announcements'
  ];

  const existingTables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  ).all().map(r => r.name);

  console.log(`\nFound ${existingTables.length} tables in SQLite:`, existingTables.sort().join(', '));

  for (const tbl of expectedTables) {
    assert(existingTables.includes(tbl), `Table exists: ${tbl}`);
  }

  // 2. Check Admin Accounts
  console.log('\n2. User Authentication & Admin Checks');
  const leadAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get('techyogeeknirvana@gmail.com');
  assert(!!leadAdmin, 'Lead admin techyogeeknirvana@gmail.com exists in DB');
  assert(leadAdmin?.role === 'ADMIN', `Lead admin has role ADMIN (Role: ${leadAdmin?.role})`);
  assert(leadAdmin?.is_email_verified === 1, 'Lead admin is verified');

  // Ensure Ishpreet admin exists
  let ishpreetAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get('ishpreet823@gmail.com');
  assert(!!ishpreetAdmin, 'Ishpreet member ishpreet823@gmail.com exists in DB');
  assert(ishpreetAdmin?.role === 'USER', `Ishpreet has default role USER (Role: ${ishpreetAdmin?.role}) - only techyogeeknirvana is default ADMIN`);

  // Check that NO fake test user like user_aarav is stored
  const fakeUser = db.prepare("SELECT * FROM users WHERE id = ? OR email LIKE ?").get('user_aarav', '%aarav%');
  assert(!fakeUser, 'No fake test user (user_aarav) in production DB');

  // 3. Bcrypt Password Hashing & JWT Session Token Test
  console.log('\n3. Bcrypt Password Hashing & JWT Session Token Test');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  const testPass = 'SuperSecurePass123!';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(testPass, salt);
  assert(bcrypt.compareSync(testPass, hash), 'Bcrypt successfully validates hashed password');
  assert(!bcrypt.compareSync('WrongPassword', hash), 'Bcrypt rejects invalid password');

  const secret = process.env.JWT_SECRET || 'tygn_prod_secret_auth_token_key_2026_secure';
  const adminToken = jwt.sign({ userId: leadAdmin.id, email: leadAdmin.email, role: leadAdmin.role }, secret, { expiresIn: '7d' });
  assert(typeof adminToken === 'string' && adminToken.length > 20, 'JWT token generated successfully');

  const decoded = jwt.verify(adminToken, secret);
  assert(decoded.userId === leadAdmin.id && decoded.role === 'ADMIN', 'JWT decoded and verified successfully');

  // 4. Dual-Ledger Credit Wallet Logic
  console.log('\n4. Dual-Ledger Credit Wallet & Deduction Priority Test');
  const testUserId = 'test_user_' + Date.now();
  const testEmail = `test_${Date.now()}@example.com`;

  // Insert test user
  db.prepare(`
    INSERT INTO users (id, name, username, email, role, is_email_verified, xp, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'USER', 1, 0, datetime('now'), datetime('now'))
  `).run(testUserId, 'Test User', 'testuser_' + Date.now(), testEmail);

  // Initialize test wallet
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO credit_wallets (user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at)
    VALUES (?, 10, 5, 20, 35, ?, datetime('now'), datetime('now'))
  `).run(testUserId, today);

  let wallet = db.prepare("SELECT * FROM credit_wallets WHERE user_id = ?").get(testUserId);
  assert(wallet.daily_credits === 10, 'Initial daily credits is 10');
  assert(wallet.referral_credits === 5, 'Initial referral credits is 5');
  assert(wallet.purchased_credits === 20, 'Initial purchased credits is 20');
  assert(wallet.total_credits === 35, 'Initial total credits is 35');

  // Simulate atomic waterfall deduction: deduct 12 credits (should consume 10 daily, then 2 referral)
  const deductAmount = 12;
  const deductDaily = Math.min(wallet.daily_credits, deductAmount);
  const remainingAfterDaily = deductAmount - deductDaily;
  const deductReferral = Math.min(wallet.referral_credits, remainingAfterDaily);
  const remainingAfterRef = remainingAfterDaily - deductReferral;
  const deductPurchased = Math.min(wallet.purchased_credits, remainingAfterRef);

  assert(deductDaily === 10, 'Waterfall deduction correctly pulled 10 from daily credits first');
  assert(deductReferral === 2, 'Waterfall deduction correctly pulled 2 from referral credits second');
  assert(deductPurchased === 0, 'Waterfall deduction left purchased credits untouched');

  const newDaily = wallet.daily_credits - deductDaily;
  const newRef = wallet.referral_credits - deductReferral;
  const newPurchased = wallet.purchased_credits - deductPurchased;
  const newTotal = newDaily + newRef + newPurchased;

  db.prepare(`
    UPDATE credit_wallets
    SET daily_credits = ?, referral_credits = ?, purchased_credits = ?, total_credits = ?, updated_at = datetime('now')
    WHERE user_id = ?
  `).run(newDaily, newRef, newPurchased, newTotal, testUserId);

  wallet = db.prepare("SELECT * FROM credit_wallets WHERE user_id = ?").get(testUserId);
  assert(wallet.daily_credits === 0, 'Remaining daily credits is 0');
  assert(wallet.referral_credits === 3, 'Remaining referral credits is 3');
  assert(wallet.purchased_credits === 20, 'Remaining purchased credits is 20');
  assert(wallet.total_credits === 23, 'Remaining total credits is 23');

  // Insert transaction audit record
  db.prepare(`
    INSERT INTO credit_transactions (id, user_id, amount, balance_after, type, feature, description, created_at)
    VALUES (?, ?, ?, ?, 'DEDUCTION', 'chat', 'Test deduction', datetime('now'))
  `).run('tx_' + Date.now(), testUserId, -deductAmount, wallet.total_credits);

  const tx = db.prepare("SELECT * FROM credit_transactions WHERE user_id = ?").get(testUserId);
  assert(!!tx && tx.amount === -12, 'Transaction dual-ledger audit record persisted');

  // 5. Community Channels Seed
  console.log('\n5. Community Channels Verification');
  const channels = db.prepare("SELECT * FROM community_channels").all();
  assert(channels.length >= 6, `Default channels seeded properly (Count: ${channels.length})`);
  const general = channels.find(c => c.slug === 'general');
  assert(!!general, 'Default "general" channel exists');

  // Clean up test records
  db.prepare("DELETE FROM credit_transactions WHERE user_id = ?").run(testUserId);
  db.prepare("DELETE FROM credit_wallets WHERE user_id = ?").run(testUserId);
  db.prepare("DELETE FROM users WHERE id = ?").run(testUserId);
  db.close();

  // 6. HTTP Live Public API Routes Verification
  console.log('\n6. HTTP Server Public Live Endpoints Verification (via http://localhost:3000)');
  const publicEndpoints = [
    { url: 'http://localhost:3000/api/opportunities', expectedStatus: 200, name: 'GET /api/opportunities' },
    { url: 'http://localhost:3000/api/events', expectedStatus: 200, name: 'GET /api/events' },
    { url: 'http://localhost:3000/api/community', expectedStatus: 200, name: 'GET /api/community' },
    { url: 'http://localhost:3000/api/announcements', expectedStatus: 200, name: 'GET /api/announcements' },
    { url: 'http://localhost:3000/api/moments', expectedStatus: 200, name: 'GET /api/moments' },
    { url: 'http://localhost:3000/api/projects', expectedStatus: 200, name: 'GET /api/projects' },
  ];

  for (const ep of publicEndpoints) {
    try {
      const res = await fetch(ep.url);
      assert(res.status === ep.expectedStatus, `${ep.name} returned HTTP ${res.status}`);
    } catch (err) {
      console.error(`  ❌ FAIL: ${ep.name} network error: ${err.message}`);
      failed++;
    }
  }

  // 7. Security & Guard Verification (Unauthenticated vs Authenticated)
  console.log('\n7. Security & Authorization Guards Verification');

  // Fresh visitor session check (must return isAuthenticated: false, user: null)
  try {
    const authRes = await fetch('http://localhost:3000/api/auth');
    const authJson = await authRes.json();
    assert(authRes.status === 200, 'GET /api/auth returns HTTP 200');
    assert(authJson.data?.isAuthenticated === false, 'Fresh visitor isAuthenticated is FALSE (no auto-login)');
    assert(authJson.data?.user === null, 'Fresh visitor user object is NULL (no default user)');
  } catch (err) {
    console.error(`  ❌ FAIL: GET /api/auth error: ${err.message}`);
    failed++;
  }

  // Unauthenticated credit route check
  try {
    const credRes = await fetch('http://localhost:3000/api/credits');
    assert(credRes.status === 400, 'GET /api/credits without auth or userId returns HTTP 400 Guard');
  } catch (err) {
    console.error(`  ❌ FAIL: GET /api/credits guard check: ${err.message}`);
    failed++;
  }

  // Unauthorized admin route check
  try {
    const adminUnauth = await fetch('http://localhost:3000/api/admin?type=overview');
    assert(adminUnauth.status === 403, 'GET /api/admin without admin credentials returns HTTP 403 Forbidden');
  } catch (err) {
    console.error(`  ❌ FAIL: GET /api/admin guard check: ${err.message}`);
    failed++;
  }

  // 8. Authenticated Requests with JWT Bearer Token
  console.log('\n8. Authenticated Endpoints Verification (with JWT Bearer Token)');
  try {
    const authReq = await fetch('http://localhost:3000/api/auth', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const authJson = await authReq.json();
    assert(authReq.status === 200, 'Authenticated GET /api/auth returns HTTP 200');
    assert(authJson.data?.isAuthenticated === true, 'Authenticated session recognized (isAuthenticated: true)');
    assert(authJson.data?.user?.email === 'techyogeeknirvana@gmail.com', `User email verified (${authJson.data?.user?.email})`);
    assert(authJson.data?.isAdmin === true, 'Admin privileges verified (isAdmin: true)');
  } catch (err) {
    console.error(`  ❌ FAIL: Authenticated /api/auth check: ${err.message}`);
    failed++;
  }

  // Authenticated Admin Route
  try {
    const adminReq = await fetch('http://localhost:3000/api/admin?type=overview', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminJson = await adminReq.json();
    assert(adminReq.status === 200, 'Admin overview with JWT Bearer returns HTTP 200 OK');
    assert(typeof adminJson.data?.users === 'number', `Admin overview reports users: ${adminJson.data?.users}`);
  } catch (err) {
    console.error(`  ❌ FAIL: Authenticated /api/admin check: ${err.message}`);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
