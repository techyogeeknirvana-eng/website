'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  Trophy, 
  Zap, 
  Globe, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Award, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const user = dbStore.getUser(username) || dbStore.getUsers()[0];

  const handleShare = () => {
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Copied profile link for ${user.name}`);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '880px' }}>
      {/* Profile Header Card */}
      <div
        className="glass-card glow-border"
        style={{
          padding: '36px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={handleShare}
          className="btn-secondary"
          style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Share2 size={14} /> Share Profile
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src={
              user.avatar && !user.avatar.includes('unsplash.com')
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0284c7&color=fff&bold=true`
            }
            alt={user.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0284c7&color=fff&bold=true`;
            }}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              border: '3px solid var(--accent-indigo)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-glow)',
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{user.name}</h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
                {user.level.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {user.title} • @{user.username}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <GraduationCap size={16} />
              <span>{user.education} ({user.collegeOrCompany})</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '24px' }}>
          {user.bio}
        </p>

        {/* Social Links & XP */}
        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {user.github && (
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            )}
            {user.portfolio && (
              <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Globe size={14} /> Portfolio
              </a>
            )}
          </div>

          <div className="badge badge-indigo" style={{ padding: '8px 16px', fontSize: '0.9rem', fontWeight: 800 }}>
            <Zap size={16} /> {user.xp} Community XP
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} style={{ color: 'var(--accent-amber)' }} /> Unlocked Badges &amp; Honors
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {user.badges.map((b, i) => (
            <div
              key={i}
              className="badge badge-amber glow-border"
              style={{ padding: '10px 18px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Verified Competencies */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
          Technical Skills &amp; Stack
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {user.skills.map((s, idx) => (
            <span key={idx} className="badge badge-cyan" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              {s}
            </span>
          ))}
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-muted)' }}>
          Areas of Interest
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {user.interests.map((it, idx) => (
            <span key={idx} className="badge" style={{ fontSize: '0.8rem' }}>
              {it}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
