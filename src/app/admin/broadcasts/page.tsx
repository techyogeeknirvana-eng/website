'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Megaphone, 
  Trash2, 
  Plus, 
  Send, 
  ArrowLeft, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Eye,
  Bell
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { SystemAnnouncement } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function AdminBroadcastsPage() {
  const { currentUser, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'USERS' | 'ADMINS'>('ALL');
  const [badge, setBadge] = useState('PLATFORM UPDATE');
  const [durationHours, setDurationHours] = useState('72'); // 3 days default
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadAnnouncements = () => {
    setAnnouncements(dbStore.getAnnouncements());
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !currentUser) return;

    soundEffects.playClick();
    setIsPublishing(true);

    let expiresAt: string | undefined = undefined;
    if (durationHours !== 'forever') {
      const hours = parseInt(durationHours) || 72;
      expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    }

    dbStore.createAnnouncement(
      title.trim(),
      message.trim(),
      targetAudience,
      currentUser,
      badge.trim() || 'ADMIN BROADCAST',
      expiresAt
    );

    soundEffects.playSuccess();
    setSuccessMessage('Announcement broadcasted successfully to platform users!');
    setTimeout(() => setSuccessMessage(''), 4000);

    // Reset Form
    setTitle('');
    setMessage('');
    setBadge('PLATFORM UPDATE');
    setIsPublishing(false);
    loadAnnouncements();
  };

  const handleDeleteAnnouncement = (id: string, annTitle: string) => {
    if (!currentUser) return;
    if (confirm(`Revoke and delete broadcast "${annTitle}"?`)) {
      soundEffects.playClick();
      dbStore.deleteAnnouncement(id, currentUser);
      soundEffects.playSuccess();
      loadAnnouncements();
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      <a
        href="/admin"
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} /> Back to Admin Overview
      </a>

      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
          Real-Time Notifications Hub
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Broadcast Announcement Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '750px' }}>
          Dispatch high-priority system announcements, feature updates, and urgent alerts. Active notifications pop up automatically for users upon logging in.
        </p>
      </div>

      {successMessage && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: 'var(--accent-emerald)',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {/* Grid: Create Form & Live Preview on left, Active Broadcasts on right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Creator Studio */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(234, 179, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)',
              }}
            >
              <Megaphone size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Broadcast</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publish an instant platform-wide banner</p>
            </div>
          </div>

          <form onSubmit={handleCreateAnnouncement}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Announcement Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Welcome to TYGN 2.0 • Daily Free Credits Added!"
                className="input-custom"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Notification Message Body *
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Write the announcement details clearly. Explain new features, downtime, or community news..."
                className="input-custom"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className="input-custom"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}
                >
                  <option value="ALL">Everyone (ALL)</option>
                  <option value="USERS">Regular Members (USERS)</option>
                  <option value="ADMINS">Staff Only (ADMINS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  placeholder="e.g. NEW FEATURE"
                  className="input-custom"
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Broadcast Lifespan
              </label>
              <select
                value={durationHours}
                onChange={e => setDurationHours(e.target.value)}
                className="input-custom"
                style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}
              >
                <option value="24">24 Hours</option>
                <option value="72">3 Days (Recommended)</option>
                <option value="168">7 Days (1 Week)</option>
                <option value="720">30 Days</option>
                <option value="forever">Permanent (Until manually revoked)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPublishing || !title.trim() || !message.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.92rem' }}
            >
              <Send size={16} /> {isPublishing ? 'Broadcasting...' : 'Publish Broadcast'}
            </button>
          </form>

          {/* Live Mock Preview */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              <Eye size={14} /> LIVE USER PREVIEW:
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(26, 16, 60, 0.9) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {badge || 'ANNOUNCEMENT'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Target: {targetAudience}</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {title || 'Announcement Title Preview'}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {message || 'The full message text will be displayed here in the user notification modal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Existing Announcements Feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Broadcast History ({announcements.length})</h2>
            <button
              onClick={() => {
                soundEffects.playClick();
                loadAnnouncements();
              }}
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}
            >
              Refresh
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Radio size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <p>No announcements found. Publish your first broadcast using the studio.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {announcements.map((ann) => {
                const isExpired = ann.expiresAt && new Date(ann.expiresAt).getTime() < Date.now();

                return (
                  <div
                    key={ann.id}
                    className="glass-card"
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      border: isExpired ? '1px solid var(--border-subtle)' : '1px solid rgba(6, 182, 212, 0.3)',
                      opacity: isExpired ? 0.6 : 1,
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          {ann.badge || 'BROADCAST'}
                        </span>
                        <span
                          className={isExpired ? 'badge badge-rose' : 'badge badge-emerald'}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isExpired ? 'EXPIRED' : 'ACTIVE'}
                        </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          Audience: {ann.targetAudience}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                        className="btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Delete and revoke broadcast"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {ann.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                      {ann.message}
                    </p>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span>By: <strong>{ann.createdBy}</strong></span>
                      <span>Created: {new Date(ann.createdAt).toLocaleDateString()}</span>
                      {ann.expiresAt && (
                        <span>Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
