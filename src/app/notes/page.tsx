'use client';

import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  FolderDown,
  ArrowRight,
  GraduationCap,
  HardDrive
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function NotesDrivePage() {
  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA';
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(DRIVE_FOLDER_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '50px 20px 90px 20px', maxWidth: '980px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            marginBottom: '16px',
          }}
        >
          <FolderGit2 size={15} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
            OFFICIAL B.TECH ACADEMIC REPOSITORY
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
          B.Tech Curriculum <span className="text-gradient">Notes Drive</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
          All syllabus, handwritten notes, previous years&apos; question papers (PYQs), and laboratory code files are centralized in one single official Google Drive folder for all 8 engineering semesters.
        </p>
      </div>

      {/* SINGLE DIRECT GOOGLE DRIVE CONNECT PORTAL */}
      <div
        className="glass-card glow-border"
        style={{
          padding: 'clamp(32px, 5vw, 56px)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-glass-card)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          position: 'relative',
          marginBottom: '40px',
        }}
      >
        {/* Drive Icon Emblem */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(99, 102, 241, 0.18))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 0 24px rgba(6, 182, 212, 0.25)',
          }}
        >
          <HardDrive size={38} style={{ color: 'var(--accent-cyan)' }} />
        </div>

        <div className="badge badge-emerald" style={{ marginBottom: '14px', fontSize: '0.78rem', padding: '4px 12px' }}>
          <ShieldCheck size={14} /> Official Verified Community Folder
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Connect to B.Tech Notes Drive
        </h2>

        <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: 1.55 }}>
          Direct access to the comprehensive repository containing 450+ curated documents, question banks, and lecture files.
        </p>

        {/* Big Direct Connection Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEffects.playSuccess()}
            className="btn btn-primary"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 24px rgba(6, 182, 212, 0.4)',
            }}
          >
            <FolderDown size={22} />
            <span>Open Google Drive Folder</span>
            <ExternalLink size={16} />
          </a>

          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            style={{
              padding: '16px 24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {copied ? <Check size={17} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={17} />}
            <span>{copied ? 'Link Copied!' : 'Copy Drive Link'}</span>
          </button>
        </div>

        {/* Direct Link Display Box */}
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-all',
            textAlign: 'left',
          }}
        >
          <span>{DRIVE_FOLDER_URL}</span>
          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            Direct Link →
          </a>
        </div>
      </div>

      {/* Drive Features / Security Guarantee */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        <div className="glass-card" style={{ padding: '22px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <GraduationCap size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Semesters 1 to 8</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Organized structure covering foundational sciences, core CSE/IT subjects, and advanced electives.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '22px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Free Community Access</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Open to all engineering students with zero paywalls, zero ads, and instant high-speed downloads.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '22px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Verified by Guild</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Reviewed by Techyogeek Nirvana academic moderators to ensure curriculum accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}
