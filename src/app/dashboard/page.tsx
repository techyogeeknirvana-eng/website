'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Calendar, 
  Radio, 
  Users, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Zap, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Layers,
  Gift,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent, Quiz } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ReferralModal } from '@/components/referral/ReferralModal';

export default function DashboardPage() {
  const { currentUser, refreshUserData } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 2));
    setQuizzes(dbStore.getQuizzes().slice(0, 2));
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!currentUser) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '60vh' }} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card glow-border"
        style={{
          padding: '36px',
          marginBottom: '36px',
          background: 'linear-gradient(135deg, rgba(13, 18, 29, 0.9), rgba(99, 102, 241, 0.15))',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
              LEVEL: {currentUser.level.toUpperCase()}
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
              <Flame size={12} /> 7 DAY STREAK
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
            {getTimeGreeting()}, {currentUser.name} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1rem', maxWidth: '600px' }}>
            {currentUser.title} at {currentUser.collegeOrCompany}. AI has surfaced 4 opportunities and 2 upcoming events matching your expertise in{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{currentUser.skills.slice(0, 3).join(', ')}</strong>.
          </p>
        </div>

        {/* User Stats Card */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              textAlign: 'center',
              minWidth: '110px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-indigo)' }}>
              <Zap size={18} />
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentUser.xp}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community XP</div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              textAlign: 'center',
              minWidth: '110px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-amber)' }}>
              <Trophy size={18} />
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentUser.badges.length}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Badges Earned</div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              textAlign: 'center',
              minWidth: '110px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
              <Users size={18} />
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentUser.referralCount || 0}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Invites Sent</div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Quick Actions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}
        >
          <a
            href="/opportunities?type=internship"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <Briefcase size={16} style={{ color: 'var(--accent-cyan)' }} /> Find Internship
          </a>
          <a
            href="/opportunities?type=job"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <TrendingUp size={16} style={{ color: 'var(--accent-emerald)' }} /> Find Job
          </a>
          <a
            href="/live/create"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <Radio size={16} style={{ color: 'var(--accent-amber)' }} /> Create Quiz
          </a>
          <a
            href="/community"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <Users size={16} style={{ color: 'var(--accent-indigo)' }} /> Community
          </a>
          <a
            href="/resume-lab"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <FileText size={16} style={{ color: 'var(--accent-violet)' }} /> Check Resume
          </a>
          <a
            href="/opportunities/submit"
            onClick={() => soundEffects.playClick()}
            className="btn btn-primary"
            style={{ padding: '14px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <PlusCircle size={16} /> Post Opportunity
          </a>
        </div>
      </div>

      {/* Referral & Invites Hub Card */}
      {(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nirvana.community';
        const referralCode = currentUser.referralCode || `TYGN-${(currentUser.username || 'USER').toUpperCase()}`;
        const referralLink = `${origin}/?ref=${encodeURIComponent(referralCode)}`;
        const invitesCount = currentUser.referralCount || 0;
        const creditsEarned = invitesCount * 10;

        const handleCopyLink = () => {
          soundEffects.playSuccess();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink);
          }
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2500);
        };

        return (
          <div
            className="glass-card glow-border"
            style={{
              marginBottom: '40px',
              padding: '28px 32px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(20, 16, 38, 0.95) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(6, 182, 212, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  <Gift size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      REFERRAL REWARDS
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                    Invite Friends &amp; Earn Permanent Credits
                  </h2>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsReferralModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <ExternalLink size={14} /> Full Referral Program
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Share your personal invite link. For each friend who signs up using your code, you immediately receive{' '}
              <strong style={{ color: 'var(--accent-cyan)' }}>10 Permanent Credits</strong>, and your friend gets 10 welcome credits!
            </p>

            {/* Metrics & Copy Link Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>FRIENDS JOINED</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {invitesCount}
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>PERMANENT CREDITS</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                    +{creditsEarned}
                  </div>
                </div>
              </div>

              {/* Referral Link Copy Field */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '5px 5px 5px 12px',
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem',
                    flex: 1,
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Grid: AI Recommendations & Your Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
        }}
      >
        {/* Recommended For You */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-indigo)' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Recommendations for You</h2>
            </div>
            <a href="/opportunities" style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>
              View All
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {opportunities.map(opp => (
              <div
                key={opp.id}
                className="glass-card glass-card-interactive"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opp.company}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{opp.title}</div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    AI MATCH: 94%
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Matches your verified skills in {opp.skills.slice(0, 2).join(', ')}.
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {opp.stipendOrSalary}
                  </span>
                  <a
                    href={`/opportunities?id=${opp.id}`}
                    onClick={() => soundEffects.playClick()}
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '4px 8px', textDecoration: 'none', color: 'var(--accent-cyan)' }}
                  >
                    Details <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}

            {/* Event Recommendation */}
            {events.length > 0 && (
              <div
                className="glass-card glass-card-interactive"
                style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}
              >
                <div className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                  RECOMMENDED EVENT
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{events[0].title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {events[0].date} • {events[0].participantsCount} participants registered
                </div>
                <a
                  href={`/events?id=${events[0].id}`}
                  onClick={() => soundEffects.playClick()}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', marginTop: '12px', fontSize: '0.8rem', padding: '6px 12px', textDecoration: 'none' }}
                >
                  Register Now
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Your Activity & Submissions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Clock size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Your Platform Activity</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status of user's submissions */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} /> Submissions &amp; Approvals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Open Source Community Day</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Community Event Submission</div>
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                    PENDING APPROVAL
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Junior DevOps &amp; Cloud Engineer</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Aether Cloud Labs</div>
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                    IN REVIEW
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={16} style={{ color: 'var(--accent-amber)' }} /> Badges Unlocked
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(currentUser.badges || []).map((b: string, i: number) => (
                  <span key={i} className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Quizzes */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={16} style={{ color: 'var(--accent-rose)' }} /> Live Quizzes &amp; Challenges
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quizzes.map(q => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                    <span>{q.title}</span>
                    <a
                      href={`/live/create?quizId=${q.id}`}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}
                    >
                      Play
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
    </ProtectedRoute>
  );
}
