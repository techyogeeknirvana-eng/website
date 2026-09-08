'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, Sparkles, Gift, ShoppingCart, HelpCircle, ChevronDown, Check, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { BuyCreditsModal } from './BuyCreditsModal';
import { ReferralModal } from '../referral/ReferralModal';
import { TokenStatementModal } from './TokenStatementModal';

export function CreditChip() {
  const { wallet, currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!currentUser) return null;

  const daily = wallet?.dailyCredits ?? 10;
  const referral = wallet?.referralCredits ?? 0;
  const purchased = wallet?.purchasedCredits ?? 0;
  const total = wallet?.totalCredits ?? (daily + referral + purchased);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => {
          soundEffects.playClick();
          setDropdownOpen(!dropdownOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.2)',
          color: 'var(--accent-amber)',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title="Credit Wallet & Balance"
      >
        <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
        <span>{total} Credits</span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {dropdownOpen && (
        <>
          {/* Click-outside dismiss backdrop */}
          <div
            onClick={() => setDropdownOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              backgroundColor: 'transparent',
            }}
          />

          <div
            className="animate-fadeIn"
            style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '320px',
              padding: '18px',
              borderRadius: '20px',
              background: '#090d19',
              backgroundImage: 'linear-gradient(180deg, #0f1629 0%, #080c16 100%)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.98), 0 0 35px rgba(245, 158, 11, 0.2)',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} style={{ color: 'var(--accent-amber)' }} />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                  Credit Wallet
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setDropdownOpen(false);
                    setStatementModalOpen(true);
                  }}
                  style={{
                    background: '#1e1c18',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  title="View full token statement & ledger"
                >
                  <FileText size={11} /> Statement
                </button>
                <span className="badge badge-amber" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  ⚡ {total} Total
                </span>
              </div>
            </div>

            {/* Dual Ledger Breakdown */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '13px',
                borderRadius: '12px',
                background: '#131b2e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <span>☀️ Daily Allowance:</span>
                </div>
                <span style={{ fontWeight: 700, color: '#fcd34d' }}>{daily} / 10</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '16px' }}>
                • Resets at 00:00 midnight (expires daily)
              </div>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '2px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <span>🎁 Referral Credits:</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{referral}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '16px' }}>
                • Permanent (earned by inviting friends)
              </div>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '2px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <span>💎 Purchased Credits:</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>{purchased}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '16px' }}>
                • Permanent balance (never expires)
              </div>
            </div>

            {/* Feature Rates Notice */}
            <div
              style={{
                fontSize: '0.74rem',
                color: '#94a3b8',
                marginBottom: '14px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#070a13',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div>💬 <strong>Chat Message:</strong> 1 credit / send</div>
              <div>📄 <strong>AI Resume Scanner:</strong> 2 credits / run</div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setDropdownOpen(false);
                  setStatementModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  background: '#1c1929',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: 'var(--accent-amber)',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                }}
              >
                <FileText size={14} /> View Token Statement &amp; History
              </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                setBuyModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <ShoppingCart size={14} /> Buy Credits
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                setReferralModalOpen(true);
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Gift size={14} /> Refer a Friend (+10)
            </button>
          </div>
        </div>
      </>
    )}

      {/* Modals */}
      <TokenStatementModal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
      />
      <BuyCreditsModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        onOpenReferral={() => setReferralModalOpen(true)}
      />
      <ReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
}
