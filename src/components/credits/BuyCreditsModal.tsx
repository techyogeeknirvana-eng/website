'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Zap, Check, ShieldCheck, ArrowRight, Gift } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReferral?: () => void;
}

export function BuyCreditsModal({ isOpen, onClose, onOpenReferral }: BuyCreditsModalProps) {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'titan'>('pro');
  const [showComingSoonToast, setShowComingSoonToast] = useState(false);
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

  if (!isOpen || !mounted) return null;

  const handlePurchaseAttempt = (tierName: string) => {
    soundEffects.playClick();
    setShowComingSoonToast(true);
    setTimeout(() => {
      setShowComingSoonToast(false);
    }, 4500);
  };

  const tiers = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: '$4.99',
      tag: 'Quick Boost',
      features: ['50 Permanent Credits', 'Never expires at midnight', 'Instant activation', 'Community Chat & AI Scans'],
    },
    {
      id: 'pro',
      name: 'Pro Builder',
      credits: 200,
      price: '$14.99',
      tag: 'Most Popular',
      popular: true,
      features: ['200 Permanent Credits', 'Never expires at midnight', 'Priority AI scoring', 'Saves 25% vs Starter'],
    },
    {
      id: 'titan',
      name: 'Titan Elite',
      credits: 1000,
      price: '$49.99',
      tag: 'Best Value',
      features: ['1,000 Permanent Credits', 'Never expires at midnight', 'Unlimited AI scans & tools', 'Special Discord badge'],
    },
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fadeIn"
        style={{
          maxWidth: '740px',
          width: '100%',
          padding: '36px 32px',
          borderRadius: '28px',
          background: '#090d19',
          backgroundImage: 'radial-gradient(ellipse at top, #141c33 0%, #080c16 100%)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.98), 0 0 40px rgba(245, 158, 11, 0.2)',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Coming Soon Toast Overlay */}
        {showComingSoonToast && (
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              animation: 'bounceIn 0.3s ease',
            }}
          >
            <Sparkles size={18} />
            <span>Coming Soon! Stripe direct payment checkout integration is in progress.</span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '10px' }}>
            ⚡ Persistent Token Packs
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Upgrade Your Credit Wallet
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Permanent credits never expire at midnight. Use them seamlessly whenever your free daily credits run out.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedTier(tier.id as any);
                }}
                style={{
                  borderRadius: '20px',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid var(--accent-amber)'
                    : '1px solid var(--border-subtle)',
                  background: isSelected
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {tier.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      background: 'var(--gradient-amber)',
                      color: '#000',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                    }}
                  >
                    POPULAR
                  </span>
                )}

                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {tier.name}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '6px 0' }}>
                    {tier.credits} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Credits</span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                    {tier.price}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <Check size={13} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchaseAttempt(tier.name);
                  }}
                  className={isSelected ? 'btn-premium' : 'btn btn-secondary'}
                  style={{ width: '100%', marginTop: '20px', padding: '9px 12px', fontSize: '0.86rem' }}
                >
                  Buy {tier.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Free Referral Alternative Callout */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={20} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Want free permanent credits instead?
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Invite fellow students with your referral link and get 10 persistent credits for every signup!
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onOpenReferral) onOpenReferral();
            }}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            Get Referral Link <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
