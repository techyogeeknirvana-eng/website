'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  FileText, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Gift,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { CreditTransaction, CreditWallet } from '@/types';
import { api } from '@/lib/client/api';
import { soundEffects } from '@/lib/audio/soundEffects';

interface TokenStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TokenStatementModal({ isOpen, onClose }: TokenStatementModalProps) {
  const { currentUser, wallet, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [liveWallet, setLiveWallet] = useState<CreditWallet | null>(wallet);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'GRANTS' | 'DEDUCTIONS'>('ALL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchStatement = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await api.credits.getWallet(currentUser.id);
      if (res.data) {
        if (res.data.wallet) setLiveWallet(res.data.wallet);
        if (res.data.transactions) setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch statement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchStatement();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !mounted) return null;

  const activeWallet = liveWallet || wallet;
  const daily = activeWallet?.dailyCredits ?? 10;
  const referral = activeWallet?.referralCredits ?? 0;
  const purchased = activeWallet?.purchasedCredits ?? 0;
  const total = activeWallet?.totalCredits ?? (daily + referral + purchased);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'GRANTS') return t.amount > 0;
    if (filter === 'DEDUCTIONS') return t.amount < 0;
    return true;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Today';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getBadgeForType = (type: string, amount: number) => {
    if (type === 'DAILY_GRANT') {
      return { label: 'Daily Allowance', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
    }
    if (type === 'REFERRAL_BONUS') {
      return { label: 'Referral Reward', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' };
    }
    if (type === 'PURCHASE') {
      return { label: 'Purchased', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' };
    }
    if (amount < 0) {
      return { label: 'Expenditure', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' };
    }
    return { label: 'Credit', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          background: '#090d19',
          backgroundImage: 'radial-gradient(ellipse at top, #141c33 0%, #080c16 100%)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.98), 0 0 40px rgba(245, 158, 11, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#0c1222',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Token Statement
                </h2>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  <ShieldCheck size={11} style={{ marginRight: '3px' }} /> Verified Ledger
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Audited transaction statement for {currentUser?.email || currentUser?.name || 'Account'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                soundEffects.playClick();
                fetchStatement();
                refreshWallet();
              }}
              disabled={loading}
              title="Refresh Statement"
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: '10px', color: 'var(--text-secondary)' }}
            >
              <RotateCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: '10px', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Balance Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                padding: '12px',
                borderRadius: '14px',
                background: '#131929',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                ☀️ Daily Allowance
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d' }}>
                {daily} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>/ 10</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                Resets daily at 00:00
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '14px',
                background: '#0d1d2b',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                🎁 Referral Tokens
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {referral}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                Permanent balance
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '14px',
                background: '#131530',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                💎 Purchased Tokens
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                {purchased}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                Permanent balance
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '14px',
                background: '#1a1924',
                border: '1px solid rgba(245, 158, 11, 0.5)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                ⚡ Net Available
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {total} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Tokens</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: '#10b981', marginTop: '2px' }}>
                Live active balance
              </div>
            </div>
          </div>

          {/* Statement Filter Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '10px',
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Transaction History ({filteredTransactions.length})
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ALL', 'GRANTS', 'DEDUCTIONS'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    soundEffects.playClick();
                    setFilter(f);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: filter === f ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: filter === f ? 'var(--accent-amber)' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f === 'ALL' ? 'All' : f === 'GRANTS' ? 'Grants (+)' : 'Spent (-)'}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <RotateCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <div>Fetching verified statement...</div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '36px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: '0 0 6px 0' }}>Clean Token Statement</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, maxWidth: '400px', marginInline: 'auto' }}>
                No token purchases or unauthorized debits found. You have your full 10 free daily token allowance ready to use.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTransactions.map((tx) => {
                const badge = getBadgeForType(tx.type, tx.amount);
                const isPositive = tx.amount > 0;

                return (
                  <div
                    key={tx.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                          color: isPositive ? '#10b981' : '#f43f5e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {tx.description}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.label}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {formatDate(tx.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: '0.94rem',
                          fontWeight: 800,
                          color: isPositive ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Bal: {tx.balanceAfter ?? total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#090d18',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Free tier renews at <strong>00:00 midnight</strong> every day.
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '6px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-md)' }}
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
