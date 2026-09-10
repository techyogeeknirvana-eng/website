'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Megaphone
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

import { AdminLiveStatusBar } from '@/components/admin/AdminLiveStatusBar';
import { Zap } from 'lucide-react';

export default function AdminOverviewPage() {
  const { currentUser, isAdmin, refreshUserData } = useAuth();
  const [analyticsDays, setAnalyticsDays] = useState<'7' | '30' | '90' | '365'>('30');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    dbStore.syncWithBackend().then(() => {
      setRefreshTick(t => t + 1);
    });
    const interval = setInterval(() => {
      dbStore.syncWithBackend().then(() => {
        setRefreshTick(t => t + 1);
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const users = dbStore.getUsers();
  const opportunities = dbStore.getOpportunities(true); // include pending
  const events = dbStore.getEvents(true); // include pending
  const moments = dbStore.getMoments(true); // include pending
  const projects = dbStore.getProjects(true); // include pending
  const auditLogs = dbStore.getAuditLogs();
  const reports = dbStore.getReports();

  const pendingOpps = opportunities.filter(o => o.status === 'pending');
  const pendingEvents = events.filter(e => e.status === 'pending');
  const pendingMoments = moments.filter(m => m.status === 'pending');
  const pendingProjects = projects.filter(p => p.approvalStatus === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');

  const totalPending = pendingOpps.length + pendingEvents.length + pendingMoments.length + pendingProjects.length + pendingReports.length;

  const approvedCount = 
    opportunities.filter(o => o.status === 'approved').length + 
    events.filter(e => e.status === 'approved').length +
    moments.filter(m => m.status === 'approved').length +
    projects.filter(p => p.approvalStatus === 'approved').length;
  const totalSubmissions = opportunities.length + events.length + moments.length + projects.length;
  const approvalRate = totalSubmissions > 0 ? ((approvedCount / totalSubmissions) * 100).toFixed(1) + '%' : '100.0%';

  const totalCreditsCirculation = users.reduce((sum, u) => sum + (dbStore.getWallet(u.id)?.totalCredits || 10), 0);

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={
                currentUser?.avatar && !currentUser.avatar.includes('unsplash.com')
                  ? currentUser.avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=0284c7&color=fff&bold=true`
              }
              alt={currentUser?.name || 'Admin'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=0284c7&color=fff&bold=true`;
              }}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-rose)',
                boxShadow: '0 0 16px rgba(244, 63, 94, 0.4)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #0b0c16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={10} style={{ color: '#fff' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Admin Control Center</h1>
              <span className="badge badge-rose">RBAC ACTIVE</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.name || 'Ishpreet Singh (Lead Admin)'}</strong> ({currentUser?.email || 'techyogeeknirvana@gmail.com'}) • Platform Administrator
            </p>
          </div>
        </div>

        {/* Admin Navigation Hub Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="/admin/moderation"
            onClick={() => soundEffects.playClick()}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem', position: 'relative', textDecoration: 'none' }}
          >
            <Clock size={16} /> Moderation Queue
            {totalPending > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px #ef4444',
                }}
              >
                {totalPending}
              </span>
            )}
          </a>

          <a
            href="/admin/users"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <Users size={16} /> User Management
          </a>

          <a
            href="/admin/audit-logs"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <FileText size={16} /> Immutable Audit Logs
          </a>

          <a
            href="/admin/broadcasts"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <Megaphone size={16} /> Broadcast Hub
          </a>
        </div>
      </div>

      {/* Live Date, Time & 12:00 AM Midnight Reset Bar */}
      <AdminLiveStatusBar onRefreshTriggered={() => { setRefreshTick(t => t + 1); refreshUserData(); }} />

      {/* Overview Stat Cards (Dynamic Real Data) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Registered Members</span>
            <Users size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            Real-time registered database accounts
          </div>
        </div>

        <a
          href="/admin/moderation"
          className="glass-card glass-card-interactive"
          style={{ padding: '24px', textDecoration: 'none', display: 'block' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pending Approvals</span>
            <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {totalPending}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', marginTop: '4px' }}>
            {pendingMoments.length} moments, {pendingProjects.length} projects, {pendingOpps.length} opps, {pendingEvents.length} events
          </div>
        </a>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Approval Rate</span>
            <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {approvalRate}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {approvedCount} of {totalSubmissions} submissions approved
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Credits in Circulation</span>
            <Zap size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {totalCreditsCirculation}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            Refreshes daily at 12:00 AM midnight
          </div>
        </div>
      </div>

      {/* Moderation Alert Bar if items pending */}
      {totalPending > 0 && (
        <div
          className="glass-card glow-border"
          style={{
            padding: '20px 24px',
            marginBottom: '36px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            background: 'rgba(245, 158, 11, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} style={{ color: 'var(--accent-amber)' }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalPending} Submissions Awaiting Moderator Review
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Public visibility is blocked until an administrator approves these entries.
              </div>
            </div>
          </div>

          <a
            href="/admin/moderation"
            onClick={() => soundEffects.playClick()}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            Review Queue Now <ArrowRight size={15} />
          </a>
        </div>
      )}

      {/* Platform Analytics Charts & Immuntable Audit Snippet */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Analytics Growth Chart Simulation */}
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Platform Activity &amp; Growth</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {(['7', '30', '90', '365'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setAnalyticsDays(d)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    background: analyticsDays === d ? 'var(--gradient-nirvana)' : 'transparent',
                    color: analyticsDays === d ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Real Platform Distribution & Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            {[
              { label: 'Opportunities Marketplace', count: opportunities.length, color: 'var(--accent-cyan)' },
              { label: 'Community Events & Hackathons', count: events.length, color: 'var(--accent-purple)' },
              { label: 'Community Chat Discussions', count: dbStore.getMessages('general').length, color: 'var(--accent-emerald)' },
              { label: 'Nirvana Social Moments', count: dbStore.getMoments().length, color: 'var(--accent-rose)' },
              { label: 'Showcase Projects', count: dbStore.getProjects().length, color: 'var(--accent-indigo)' },
              { label: 'Skill Challenges & Quizzes', count: dbStore.getQuizzes().length, color: 'var(--accent-amber)' },
            ].map((item, idx) => {
              const maxVal = Math.max(opportunities.length, events.length, dbStore.getMessages('general').length, 10);
              const pct = Math.min(100, Math.max(12, Math.round((item.count / maxVal) * 100)));
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <strong style={{ color: item.color }}>{item.count} items</strong>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
            Real-time entity counts synced with SQLite database storage.
          </div>
        </div>

        {/* Recent Audit Logs Feed */}
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Immutable Audit Logs</span>
            </div>

            <a href="/admin/audit-logs" style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', textDecoration: 'none' }}>
              View All
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {auditLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{log.details}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Actor: {log.actorName} ({log.actorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
