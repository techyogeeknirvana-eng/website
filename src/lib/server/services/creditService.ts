import { getDatabase } from '../db/client';
import { CreditWallet, CreditTransaction, User } from '@/types';
import crypto from 'crypto';

export const DAILY_DEFAULT_ALLOWANCE = 10;
export const REFERRAL_BONUS_CREDITS = 10;

export const creditService = {
  getOrCreateWallet(userId: string, clientDate?: string): CreditWallet {
    const db = getDatabase();
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    let row = db.prepare('SELECT * FROM credit_wallets WHERE user_id = ?').get(userId) as any;

    if (!row) {
      db.prepare(`
        INSERT INTO credit_wallets (
          user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, DAILY_DEFAULT_ALLOWANCE, 0, 0, DAILY_DEFAULT_ALLOWANCE, today, now, now);

      row = db.prepare('SELECT * FROM credit_wallets WHERE user_id = ?').get(userId) as any;
    } else if (row.last_daily_reset !== today) {
      // Midnight rollover reset: previous unspent daily credits zero out, fresh 10 granted
      const newTotal = DAILY_DEFAULT_ALLOWANCE + (row.referral_credits || 0) + (row.purchased_credits || 0);
      db.prepare(`
        UPDATE credit_wallets SET
          daily_credits = ?,
          total_credits = ?,
          last_daily_reset = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, userId);

      // Record daily reset transaction
      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'tx_' + crypto.randomUUID(),
        userId,
        DAILY_DEFAULT_ALLOWANCE,
        'DAILY_GRANT',
        'system',
        'Daily credit allowance reset (10 fresh credits)',
        newTotal,
        now
      );

      row = db.prepare('SELECT * FROM credit_wallets WHERE user_id = ?').get(userId) as any;
    }

    return {
      userId: row.user_id,
      dailyCredits: row.daily_credits,
      referralCredits: row.referral_credits,
      purchasedCredits: row.purchased_credits,
      totalCredits: row.total_credits,
      lastDailyReset: row.last_daily_reset,
    };
  },

  resetUserDailyCredits(userId: string, force = false, clientDate?: string): CreditWallet {
    const db = getDatabase();
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const w = this.getOrCreateWallet(userId, today);
    if (!force && w.lastDailyReset === today) {
      return w;
    }

    const row = db.prepare('SELECT * FROM credit_wallets WHERE user_id = ?').get(userId) as any;
    const newTotal = DAILY_DEFAULT_ALLOWANCE + (row.referral_credits || 0) + (row.purchased_credits || 0);

    db.prepare(`
      UPDATE credit_wallets SET
        daily_credits = ?,
        total_credits = ?,
        last_daily_reset = ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, userId);

    db.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'tx_' + crypto.randomUUID(),
      userId,
      DAILY_DEFAULT_ALLOWANCE,
      'DAILY_GRANT',
      'system',
      force ? 'Manual daily credit refresh (10 fresh credits)' : 'Midnight credit rollover (10 fresh credits)',
      newTotal,
      now
    );

    return {
      userId,
      dailyCredits: DAILY_DEFAULT_ALLOWANCE,
      referralCredits: row.referral_credits || 0,
      purchasedCredits: row.purchased_credits || 0,
      totalCredits: newTotal,
      lastDailyReset: today,
    };
  },

  resetAllDailyCredits(force = false, clientDate?: string): { count: number; affectedUserIds: string[] } {
    const db = getDatabase();
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const query = force
      ? 'SELECT * FROM credit_wallets'
      : 'SELECT * FROM credit_wallets WHERE last_daily_reset != ?';
    const params = force ? [] : [today];
    const wallets = db.prepare(query).all(...params) as any[];

    const affectedUserIds: string[] = [];

    const updateStmt = db.prepare(`
      UPDATE credit_wallets SET
        daily_credits = ?,
        total_credits = ?,
        last_daily_reset = ?,
        updated_at = ?
      WHERE user_id = ?
    `);

    const txStmt = db.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const runInTx = db.transaction((rows: any[]) => {
      for (const w of rows) {
        const newTotal = DAILY_DEFAULT_ALLOWANCE + (w.referral_credits || 0) + (w.purchased_credits || 0);
        updateStmt.run(DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, w.user_id);

        txStmt.run(
          'tx_' + crypto.randomUUID(),
          w.user_id,
          DAILY_DEFAULT_ALLOWANCE,
          'DAILY_GRANT',
          'system',
          force ? 'Manual daily credit refresh (10 fresh credits)' : 'Midnight credit rollover (10 fresh credits)',
          newTotal,
          now
        );
        affectedUserIds.push(w.user_id);
      }
    });

    runInTx(wallets);

    return {
      count: affectedUserIds.length,
      affectedUserIds,
    };
  },

  deductCredits(
    userId: string,
    amount: number,
    description: string,
    feature: 'chat' | 'resume' | 'admin' | 'system' = 'system'
  ): { success: boolean; wallet: CreditWallet; transaction?: CreditTransaction; error?: string } {
    const db = getDatabase();
    const wallet = this.getOrCreateWallet(userId);

    if (wallet.totalCredits < amount) {
      return { success: false, wallet, error: 'Insufficient credit balance.' };
    }

    let remaining = amount;
    let newDaily = wallet.dailyCredits;
    let newReferral = wallet.referralCredits;
    let newPurchased = wallet.purchasedCredits;

    // 1. Daily pool first
    const fromDaily = Math.min(newDaily, remaining);
    newDaily -= fromDaily;
    remaining -= fromDaily;

    // 2. Referral permanent pool second
    if (remaining > 0) {
      const fromRef = Math.min(newReferral, remaining);
      newReferral -= fromRef;
      remaining -= fromRef;
    }

    // 3. Purchased pool third
    if (remaining > 0) {
      const fromPurchased = Math.min(newPurchased, remaining);
      newPurchased -= fromPurchased;
      remaining -= fromPurchased;
    }

    const newTotal = newDaily + newReferral + newPurchased;
    const now = new Date().toISOString();
    const txId = 'tx_' + crypto.randomUUID();

    // Atomic transaction
    const executeDeduction = db.transaction(() => {
      db.prepare(`
        UPDATE credit_wallets SET
          daily_credits = ?,
          referral_credits = ?,
          purchased_credits = ?,
          total_credits = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(newDaily, newReferral, newPurchased, newTotal, now, userId);

      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(txId, userId, -amount, 'DEDUCTION', feature, description, newTotal, now);
    });

    executeDeduction();

    const updatedWallet: CreditWallet = {
      userId,
      dailyCredits: newDaily,
      referralCredits: newReferral,
      purchasedCredits: newPurchased,
      totalCredits: newTotal,
      lastDailyReset: wallet.lastDailyReset,
    };

    const tx: CreditTransaction = {
      id: txId,
      userId,
      amount: -amount,
      type: 'DEDUCTION',
      feature,
      description,
      balanceAfter: newTotal,
      timestamp: now,
    };

    return { success: true, wallet: updatedWallet, transaction: tx };
  },

  adjustCreditsAdmin(
    userId: string,
    deltaDaily: number,
    deltaPersistent: number,
    reason: string,
    adminUser: User
  ): CreditWallet {
    const db = getDatabase();
    const wallet = this.getOrCreateWallet(userId);

    const newDaily = Math.max(0, wallet.dailyCredits + deltaDaily);
    const newPurchased = Math.max(0, wallet.purchasedCredits + deltaPersistent);
    const newTotal = newDaily + wallet.referralCredits + newPurchased;
    const now = new Date().toISOString();
    const txId = 'tx_' + crypto.randomUUID();

    const executeAdjustment = db.transaction(() => {
      db.prepare(`
        UPDATE credit_wallets SET
          daily_credits = ?,
          purchased_credits = ?,
          total_credits = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(newDaily, newPurchased, newTotal, now, userId);

      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        txId,
        userId,
        deltaDaily + deltaPersistent,
        'ADMIN_ADJUST',
        'admin',
        `Admin adjustment (${reason}): Daily ${deltaDaily >= 0 ? '+' : ''}${deltaDaily}, Persistent ${deltaPersistent >= 0 ? '+' : ''}${deltaPersistent}`,
        newTotal,
        now
      );

      db.prepare(`
        INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'log_' + crypto.randomUUID(),
        now,
        adminUser.id,
        adminUser.name,
        adminUser.role,
        'ADJUST_CREDITS',
        'user',
        userId,
        `Adjusted credits: daily ${deltaDaily >= 0 ? '+' : ''}${deltaDaily}, persistent ${deltaPersistent >= 0 ? '+' : ''}${deltaPersistent}. Reason: ${reason}`,
        'success'
      );
    });

    executeAdjustment();

    return {
      userId,
      dailyCredits: newDaily,
      referralCredits: wallet.referralCredits,
      purchasedCredits: newPurchased,
      totalCredits: newTotal,
      lastDailyReset: wallet.lastDailyReset,
    };
  },

  processReferral(
    newUserId: string,
    newUserEmail: string,
    referralCode: string
  ): boolean {
    const db = getDatabase();
    if (!referralCode || !newUserId) return false;
    const cleanCode = referralCode.trim().toUpperCase();
    const cleanUserEmail = (newUserEmail || '').toLowerCase().trim();

    // Check if referral already processed for this user
    const alreadyProcessed = db.prepare(
      'SELECT id FROM referrals WHERE referred_user_id = ? OR LOWER(referred_email) = ?'
    ).get(newUserId, cleanUserEmail);
    if (alreadyProcessed) return false;

    // Match referrer by referral_code, username, or email
    const referrerRow = db.prepare(`
      SELECT id, name, username, email, referral_code, referral_count 
      FROM users 
      WHERE (
        UPPER(referral_code) = ? 
        OR UPPER(username) = ? 
        OR UPPER(email) = ?
        OR UPPER(referral_code) = ?
      )
      AND id != ? 
      AND LOWER(email) != ?
    `).get(
      cleanCode, 
      cleanCode, 
      cleanCode, 
      cleanCode.startsWith('TYGN-') ? cleanCode : `TYGN-${cleanCode}`, 
      newUserId, 
      cleanUserEmail
    ) as any;

    if (!referrerRow) {
      console.warn(`[Referral] Referrer not found for code: "${cleanCode}" by user: ${newUserEmail}`);
      return false;
    }

    const referrerId = referrerRow.id;
    const now = new Date().toISOString();
    const refId = 'ref_' + crypto.randomUUID();

    const executeReferral = db.transaction(() => {
      // 1. Insert referral record
      db.prepare(`
        INSERT INTO referrals (id, referrer_id, referred_user_id, referred_email, referral_code, credits_awarded, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(refId, referrerId, newUserId, cleanUserEmail, cleanCode, REFERRAL_BONUS_CREDITS, now);

      // 2. Increment referrer count on user
      db.prepare(`
        UPDATE users SET referral_count = referral_count + 1, updated_at = ? WHERE id = ?
      `).run(now, referrerId);

      // 3. Award 10 permanent referral credits to referrer
      const referrerWallet = this.getOrCreateWallet(referrerId);
      const updatedRefCredits = referrerWallet.referralCredits + REFERRAL_BONUS_CREDITS;
      const updatedTotal = referrerWallet.dailyCredits + updatedRefCredits + referrerWallet.purchasedCredits;

      db.prepare(`
        UPDATE credit_wallets SET
          referral_credits = ?,
          total_credits = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(updatedRefCredits, updatedTotal, now, referrerId);

      // 4. Log transaction for referrer
      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'tx_' + crypto.randomUUID(),
        referrerId,
        REFERRAL_BONUS_CREDITS,
        'REFERRAL_BONUS',
        'referral',
        `Referral reward: User ${cleanUserEmail} joined with your invite! (+10 permanent credits)`,
        updatedTotal,
        now
      );

      // 5. Award 10 welcome permanent referral credits to the newly referred user
      const newWallet = this.getOrCreateWallet(newUserId);
      const newRefCredits = newWallet.referralCredits + REFERRAL_BONUS_CREDITS;
      const newTotal = newWallet.dailyCredits + newRefCredits + newWallet.purchasedCredits;

      db.prepare(`
        UPDATE credit_wallets SET
          referral_credits = ?,
          total_credits = ?,
          updated_at = ?
        WHERE user_id = ?
      `).run(newRefCredits, newTotal, now, newUserId);

      db.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'tx_' + crypto.randomUUID(),
        newUserId,
        REFERRAL_BONUS_CREDITS,
        'REFERRAL_BONUS',
        'referral',
        `Welcome bonus: Joined via invite from ${referrerRow.name}! (+10 permanent credits)`,
        newTotal,
        now
      );

      // 6. Update referred_by on new user
      db.prepare('UPDATE users SET referred_by = ?, updated_at = ? WHERE id = ?').run(referrerId, now, newUserId);
    });

    executeReferral();
    console.log(`[Referral] Successfully processed referral! Referrer ${referrerRow.email} now has +1 invite and +10 credits.`);
    return true;
  },

  getTransactions(userId: string, limit = 50, offset = 0): CreditTransaction[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT ? OFFSET ?
    `).all(userId, limit, offset) as any[];

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      amount: r.amount,
      type: r.type,
      feature: r.feature,
      description: r.description,
      balanceAfter: r.balance_after,
      timestamp: r.created_at,
    }));
  },
};
