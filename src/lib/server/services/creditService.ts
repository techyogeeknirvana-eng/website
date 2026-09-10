import { db } from '../db/client';
import { CreditWallet, CreditTransaction, User } from '@/types';
import crypto from 'crypto';

export const DAILY_DEFAULT_ALLOWANCE = 10;
export const REFERRAL_BONUS_CREDITS = 10;

export const creditService = {
  async getOrCreateWallet(userId: string, clientDate?: string): Promise<CreditWallet> {
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    let row = await db.queryOne('SELECT * FROM credit_wallets WHERE user_id = ?', [userId]);

    if (!row) {
      await db.execute(`
        INSERT INTO credit_wallets (
          user_id, daily_credits, referral_credits, purchased_credits, total_credits, last_daily_reset, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, DAILY_DEFAULT_ALLOWANCE, 0, 0, DAILY_DEFAULT_ALLOWANCE, today, now, now]);

      row = await db.queryOne('SELECT * FROM credit_wallets WHERE user_id = ?', [userId]);
    } else if (row.last_daily_reset !== today) {
      // Midnight rollover reset: previous unspent daily credits zero out, fresh 10 granted
      const newTotal = DAILY_DEFAULT_ALLOWANCE + (row.referral_credits || 0) + (row.purchased_credits || 0);
      await db.execute(`
        UPDATE credit_wallets SET
          daily_credits = ?,
          total_credits = ?,
          last_daily_reset = ?,
          updated_at = ?
        WHERE user_id = ?
      `, [DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, userId]);

      // Record daily reset transaction
      await db.execute(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'tx_' + crypto.randomUUID(),
        userId,
        DAILY_DEFAULT_ALLOWANCE,
        'DAILY_GRANT',
        'system',
        'Daily credit allowance reset (10 fresh credits)',
        newTotal,
        now
      ]);

      row = await db.queryOne('SELECT * FROM credit_wallets WHERE user_id = ?', [userId]);
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

  async resetUserDailyCredits(userId: string, force = false, clientDate?: string): Promise<CreditWallet> {
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const w = await this.getOrCreateWallet(userId, today);
    if (!force && w.lastDailyReset === today) {
      return w;
    }

    const row = await db.queryOne('SELECT * FROM credit_wallets WHERE user_id = ?', [userId]);
    const newTotal = DAILY_DEFAULT_ALLOWANCE + (row.referral_credits || 0) + (row.purchased_credits || 0);

    await db.execute(`
      UPDATE credit_wallets SET
        daily_credits = ?,
        total_credits = ?,
        last_daily_reset = ?,
        updated_at = ?
      WHERE user_id = ?
    `, [DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, userId]);

    await db.execute(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'tx_' + crypto.randomUUID(),
      userId,
      DAILY_DEFAULT_ALLOWANCE,
      'DAILY_GRANT',
      'system',
      force ? 'Manual daily credit refresh (10 fresh credits)' : 'Midnight credit rollover (10 fresh credits)',
      newTotal,
      now
    ]);

    return {
      userId,
      dailyCredits: DAILY_DEFAULT_ALLOWANCE,
      referralCredits: row.referral_credits || 0,
      purchasedCredits: row.purchased_credits || 0,
      totalCredits: newTotal,
      lastDailyReset: today,
    };
  },

  async resetAllDailyCredits(force = false, clientDate?: string): Promise<{ count: number; affectedUserIds: string[] }> {
    const today = (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate))
      ? clientDate
      : new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const query = force
      ? 'SELECT * FROM credit_wallets'
      : 'SELECT * FROM credit_wallets WHERE last_daily_reset != ?';
    const params = force ? [] : [today];
    const wallets = await db.queryAll(query, params);

    const affectedUserIds: string[] = [];

    for (const w of wallets) {
      const newTotal = DAILY_DEFAULT_ALLOWANCE + (w.referral_credits || 0) + (w.purchased_credits || 0);
      await db.execute(`
        UPDATE credit_wallets SET
          daily_credits = ?,
          total_credits = ?,
          last_daily_reset = ?,
          updated_at = ?
        WHERE user_id = ?
      `, [DAILY_DEFAULT_ALLOWANCE, newTotal, today, now, w.user_id]);

      await db.execute(`
        INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'tx_' + crypto.randomUUID(),
        w.user_id,
        DAILY_DEFAULT_ALLOWANCE,
        'DAILY_GRANT',
        'system',
        force ? 'Manual daily credit refresh (10 fresh credits)' : 'Midnight credit rollover (10 fresh credits)',
        newTotal,
        now
      ]);
      affectedUserIds.push(w.user_id);
    }

    return {
      count: affectedUserIds.length,
      affectedUserIds,
    };
  },

  async deductCredits(
    userId: string,
    amount: number,
    description: string,
    feature: 'chat' | 'resume' | 'admin' | 'system' = 'system'
  ): Promise<{ success: boolean; wallet: CreditWallet; transaction?: CreditTransaction; error?: string }> {
    const wallet = await this.getOrCreateWallet(userId);

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

    await db.execute(`
      UPDATE credit_wallets SET
        daily_credits = ?,
        referral_credits = ?,
        purchased_credits = ?,
        total_credits = ?,
        updated_at = ?
      WHERE user_id = ?
    `, [newDaily, newReferral, newPurchased, newTotal, now, userId]);

    await db.execute(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [txId, userId, -amount, 'DEDUCTION', feature, description, newTotal, now]);

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

  async adjustCreditsAdmin(
    userId: string,
    deltaDaily: number,
    deltaPersistent: number,
    reason: string,
    adminUser: User
  ): Promise<CreditWallet> {
    const wallet = await this.getOrCreateWallet(userId);

    const newDaily = Math.max(0, wallet.dailyCredits + deltaDaily);
    const newPurchased = Math.max(0, wallet.purchasedCredits + deltaPersistent);
    const newTotal = newDaily + wallet.referralCredits + newPurchased;
    const now = new Date().toISOString();
    const txId = 'tx_' + crypto.randomUUID();

    await db.execute(`
      UPDATE credit_wallets SET
        daily_credits = ?,
        purchased_credits = ?,
        total_credits = ?,
        updated_at = ?
      WHERE user_id = ?
    `, [newDaily, newPurchased, newTotal, now, userId]);

    await db.execute(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      txId,
      userId,
      deltaDaily + deltaPersistent,
      'ADMIN_ADJUST',
      'admin',
      `Admin adjustment (${reason}): Daily ${deltaDaily >= 0 ? '+' : ''}${deltaDaily}, Persistent ${deltaPersistent >= 0 ? '+' : ''}${deltaPersistent}`,
      newTotal,
      now
    ]);

    await db.execute(`
      INSERT INTO audit_logs (id, timestamp, actor_id, actor_name, actor_role, action, target_type, target_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ]);

    return {
      userId,
      dailyCredits: newDaily,
      referralCredits: wallet.referralCredits,
      purchasedCredits: newPurchased,
      totalCredits: newTotal,
      lastDailyReset: wallet.lastDailyReset,
    };
  },

  async processReferral(
    newUserId: string,
    newUserEmail: string,
    referralCode: string
  ): Promise<boolean> {
    if (!referralCode || !newUserId) return false;
    const cleanCode = referralCode.trim().toUpperCase();
    const cleanUserEmail = (newUserEmail || '').toLowerCase().trim();

    // Check if referral already processed for this user
    const alreadyProcessed = await db.queryOne(
      'SELECT id FROM referrals WHERE referred_user_id = ? OR LOWER(referred_email) = ?',
      [newUserId, cleanUserEmail]
    );
    if (alreadyProcessed) return false;

    // Match referrer by referral_code, username, or email
    const referrerRow = await db.queryOne(`
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
    `, [
      cleanCode, 
      cleanCode, 
      cleanCode, 
      cleanCode.startsWith('TYGN-') ? cleanCode : `TYGN-${cleanCode}`, 
      newUserId, 
      cleanUserEmail
    ]);

    if (!referrerRow) {
      console.warn(`[Referral] Referrer not found for code: "${cleanCode}" by user: ${newUserEmail}`);
      return false;
    }

    const referrerId = referrerRow.id;
    const now = new Date().toISOString();
    const refId = 'ref_' + crypto.randomUUID();

    // 1. Insert referral record
    await db.execute(`
      INSERT INTO referrals (id, referrer_id, referred_user_id, referred_email, referral_code, credits_awarded, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [refId, referrerId, newUserId, cleanUserEmail, cleanCode, REFERRAL_BONUS_CREDITS, now]);

    // 2. Increment referrer count on user
    await db.execute(`
      UPDATE users SET referral_count = referral_count + 1, updated_at = ? WHERE id = ?
    `, [now, referrerId]);

    // 3. Award 10 permanent referral credits to referrer
    const referrerWallet = await this.getOrCreateWallet(referrerId);
    const updatedRefCredits = referrerWallet.referralCredits + REFERRAL_BONUS_CREDITS;
    const updatedTotal = referrerWallet.dailyCredits + updatedRefCredits + referrerWallet.purchasedCredits;

    await db.execute(`
      UPDATE credit_wallets SET
        referral_credits = ?,
        total_credits = ?,
        updated_at = ?
      WHERE user_id = ?
    `, [updatedRefCredits, updatedTotal, now, referrerId]);

    // 4. Log transaction for referrer
    await db.execute(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'tx_' + crypto.randomUUID(),
      referrerId,
      REFERRAL_BONUS_CREDITS,
      'REFERRAL_BONUS',
      'referral',
      `Referral reward: User ${cleanUserEmail} joined with your invite! (+10 permanent credits)`,
      updatedTotal,
      now
    ]);

    // 5. Award 10 welcome permanent referral credits to the newly referred user
    const newWallet = await this.getOrCreateWallet(newUserId);
    const newRefCredits = newWallet.referralCredits + REFERRAL_BONUS_CREDITS;
    const newTotal = newWallet.dailyCredits + newRefCredits + newWallet.purchasedCredits;

    await db.execute(`
      UPDATE credit_wallets SET
        referral_credits = ?,
        total_credits = ?,
        updated_at = ?
      WHERE user_id = ?
    `, [newRefCredits, newTotal, now, newUserId]);

    await db.execute(`
      INSERT INTO credit_transactions (id, user_id, amount, type, feature, description, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'tx_' + crypto.randomUUID(),
      newUserId,
      REFERRAL_BONUS_CREDITS,
      'REFERRAL_BONUS',
      'referral',
      `Welcome bonus: Joined via invite from ${referrerRow.name}! (+10 permanent credits)`,
      newTotal,
      now
    ]);

    // 6. Update referred_by on new user
    await db.execute('UPDATE users SET referred_by = ?, updated_at = ? WHERE id = ?', [referrerId, now, newUserId]);

    console.log(`[Referral] Successfully processed referral! Referrer ${referrerRow.email} now has +1 invite and +10 credits.`);
    return true;
  },

  async getTransactions(userId: string, limit = 50, offset = 0): Promise<CreditTransaction[]> {
    const rows = await db.queryAll(`
      SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

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
