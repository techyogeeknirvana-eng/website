'use client';

import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '60px 20px',
      }}
    >
      {/* Glowing Orbital Ring Container */}
      <div style={{ position: 'relative', width: '84px', height: '84px' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)',
            filter: 'blur(16px)',
            animation: 'pulse 2s infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px dashed rgba(34,211,238,0.6)',
            animation: 'spin 5s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(165,180,252,0.5)',
            animation: 'spinReverse 8s linear infinite',
          }}
        />
        <img
          src="/assets/tygn-logo.png"
          alt="TYGN Processing..."
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            position: 'absolute',
            top: '21px',
            left: '21px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.7))',
          }}
        />
      </div>

      {/* Futuristic status readout */}
      <div style={{ textAlign: 'center', maxWidth: '340px' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
            marginBottom: '6px',
          }}
        >
          {'// PROCESSING DATA STREAM'}
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          TechYOGeek <span className="text-gradient">Nirvana</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Syncing verified nodes, notes &amp; student mainframe...
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
