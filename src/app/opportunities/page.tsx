'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  PlusCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  Building,
  Edit,
  Trash2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { Opportunity } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { aiService } from '@/lib/ai/aiService';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

export default function OpportunitiesPage() {
  const { currentUser, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'job' | 'internship' | 'freelance' | 'hackathon'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  const loadData = async () => {
    const opps = dbStore.getOpportunities(isAdmin);
    setOpportunities(opps);
    if (opps.length > 0 && !selectedOpp) setSelectedOpp(opps[0]);

    if (currentUser) {
      const saved = opps.filter(o => o.savedBy?.includes(currentUser.id)).map(o => o.id);
      setSavedIds(saved);
    }

    try {
      const res = await api.opportunities.list({ limit: 100 });
      if (res.data) {
        dbStore.setOpportunities(res.data);
        const filtered = isAdmin ? res.data : res.data.filter(o => o.status === 'approved');
        setOpportunities(filtered);
        if (filtered.length > 0 && !selectedOpp) setSelectedOpp(filtered[0]);
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadData();
  }, [currentUser, isAdmin]);

  const handleDeleteOpp = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this opportunity?')) return;
    soundEffects.playClick();
    await api.opportunities.delete(id);
    dbStore.deleteOpportunity(id, currentUser);
    setOpportunities(prev => prev.filter(o => o.id !== id));
    if (selectedOpp?.id === id) {
      setSelectedOpp(opportunities.find(o => o.id !== id) || null);
    }
  };

  const handleApproveOpp = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.opportunities.review(id, 'approved');
    dbStore.updateOpportunityStatus(id, 'approved', currentUser);
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' } : o));
    if (selectedOpp?.id === id) {
      setSelectedOpp(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleSaveOpp = async (updated: Opportunity) => {
    if (!currentUser) return;
    await api.opportunities.update(updated.id, updated);
    dbStore.updateOpportunity(updated, currentUser);
    setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
    if (selectedOpp?.id === updated.id) {
      setSelectedOpp(updated);
    }
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    soundEffects.playClick();
    const isSaved = dbStore.toggleSaveOpportunity(id, currentUser.id);
    if (isSaved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleShare = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Copied link to "${opp.title}" at ${opp.company}`);
    }
  };

  const filtered = opportunities.filter(opp => {
    if (selectedTab !== 'all' && opp.type !== selectedTab) return false;
    if (remoteOnly && !opp.isRemote) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company.toLowerCase().includes(q);
      const matchSkill = opp.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkill) return false;
    }
    return true;
  });

  const getMatchData = (opp: Opportunity) => {
    if (!currentUser) return { score: 75, reason: 'Log in to see personalized skill match' };
    return aiService.calculateOpportunityMatch(opp, currentUser);
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header Bar */}
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
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            Curated Tech Marketplace
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Jobs, Internships &amp; Fellowships
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Browse verified opportunities with AI skill matching and transparent compensation.
          </p>
        </div>

        <a
          href="/opportunities/submit"
          onClick={() => soundEffects.playClick()}
          className="btn btn-primary"
          style={{ padding: '12px 22px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
        >
          <PlusCircle size={18} /> Post an Opportunity
        </a>
      </div>

      {/* Tabs & Filter Controls */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'job', label: 'Jobs' },
            { id: 'internship', label: 'Internships' },
            { id: 'freelance', label: 'Freelance' },
            { id: 'hackathon', label: 'Hackathons' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedTab(tab.id as typeof selectedTab);
              }}
              className="btn-ghost"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: selectedTab === tab.id ? 700 : 500,
                background: selectedTab === tab.id ? 'var(--gradient-nirvana)' : 'transparent',
                color: selectedTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: selectedTab === tab.id ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Remote toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search title, company, skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                width: '200px',
              }}
            />
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={e => setRemoteOnly(e.target.checked)}
              style={{ accentColor: 'var(--accent-indigo)' }}
            />
            Remote Only
          </label>
        </div>
      </div>

      {/* Opportunities Layout: List on Left, Detail Preview on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Opportunities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Briefcase size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>No opportunities match your current filters.</div>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try clearing your search query or selecting &quot;All Opportunities&quot;.</p>
            </div>
          ) : (
            filtered.map(opp => {
              const match = getMatchData(opp);
              const isSelected = selectedOpp?.id === opp.id;
              const isSaved = savedIds.includes(opp.id);

              return (
                <div
                  key={opp.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedOpp(opp);
                  }}
                  className="glass-card glass-card-interactive"
                  style={{
                    padding: '22px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass-card)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={opp.companyLogo}
                        alt={opp.company}
                        style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{opp.company}</div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {opp.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={e => handleToggleSave(opp.id, e)}
                      className="btn-ghost"
                      style={{ padding: '6px', color: isSaved ? 'var(--accent-amber)' : 'var(--text-muted)' }}
                    >
                      <Bookmark size={18} fill={isSaved ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  {/* AI Match Score Pill (Super Unique Feature 50) */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#6ee7b7',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    <Sparkles size={12} />
                    <span>AI MATCH: {match.score}%</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{match.reason}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {opp.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      <DollarSign size={14} /> {opp.stipendOrSalary}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Deadline: {opp.deadline}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {opp.skills.map((s, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: '0.72rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Admin Direct Controls on Card */}
                  {isAdmin && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '14px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          className={
                            opp.status === 'approved'
                              ? 'badge badge-emerald'
                              : opp.status === 'rejected'
                              ? 'badge badge-rose'
                              : 'badge badge-amber'
                          }
                          style={{ fontSize: '0.68rem' }}
                        >
                          {opp.status?.toUpperCase() || 'APPROVED'}
                        </span>
                        {opp.status !== 'approved' && (
                          <button
                            onClick={e => handleApproveOpp(opp.id, e)}
                            className="btn-success"
                            style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px' }}
                          >
                            Allow
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setEditingOpp(opp);
                          }}
                          className="btn-secondary"
                          title="Modify Opportunity"
                          style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={e => handleDeleteOpp(opp.id, e)}
                          className="btn-ghost"
                          title="Delete Opportunity"
                          style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '4px', color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Opportunity Detail Drawer / Card */}
        {selectedOpp && (
          <div
            className="glass-card"
            style={{
              padding: '30px',
              position: 'sticky',
              top: '90px',
              border: '1px solid var(--border-glass)',
            }}
          >
            {/* Admin Management Header in Drawer */}
            {isAdmin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>ADMIN ACTIONS</span>
                  {selectedOpp.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveOpp(selectedOpp.id)}
                      className="btn-success"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      Approve &amp; Allow
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingOpp(selectedOpp)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={13} /> Modify
                  </button>
                  <button
                    onClick={() => handleDeleteOpp(selectedOpp.id)}
                    className="btn-ghost"
                    style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={selectedOpp.companyLogo}
                  alt={selectedOpp.company}
                  style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedOpp.title}</h2>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {selectedOpp.company} • {selectedOpp.location}
                  </div>
                </div>
              </div>

              <button onClick={e => handleShare(selectedOpp, e)} className="btn-ghost" title="Share Opportunity">
                <Share2 size={18} />
              </button>
            </div>

            {/* AI Match Overview */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>
                <Sparkles size={16} /> AI Opportunity Compatibility: {getMatchData(selectedOpp).score}%
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {getMatchData(selectedOpp).reason} This estimate is computed transparently by comparing your verified profile skills with the role specifications.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                About the Role
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selectedOpp.description}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                Required Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedOpp.skills.map((s, idx) => (
                  <span key={idx} className="badge badge-indigo">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <a
                href={selectedOpp.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playSuccess()}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
              >
                Apply Now <ExternalLink size={16} />
              </a>
              <button
                onClick={e => handleToggleSave(selectedOpp.id, e)}
                className="btn btn-secondary"
                style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)' }}
              >
                <Bookmark size={16} fill={savedIds.includes(selectedOpp.id) ? 'var(--accent-amber)' : 'none'} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Edit Modal */}
      <AdminEditModal
        isOpen={Boolean(editingOpp)}
        onClose={() => setEditingOpp(null)}
        type="opportunity"
        item={editingOpp}
        onSave={handleSaveOpp}
      />
    </div>
  );
}
