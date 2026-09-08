'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  RotateCw,
  CheckCircle2,
  Edit,
  Trash2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { Opportunity, CommunityEvent, ContentReport, NirvanaMoment, Project } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

export default function ModerationQueuePage() {
  const { currentUser, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [moments, setMoments] = useState<NirvanaMoment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'opportunities' | 'events' | 'moments' | 'projects' | 'reports' | 'history'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingEntity, setEditingEntity] = useState<{ type: 'opportunity' | 'event' | 'project' | 'moment'; item: any } | null>(null);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Initial quick load from local store
      setOpportunities(dbStore.getOpportunities(true));
      setEvents(dbStore.getEvents(true));
      setMoments(dbStore.getMoments(true));
      setProjects(dbStore.getProjects(true));
      setReports(dbStore.getReports());

      // 2. Fetch directly from backend REST APIs
      const [oppsApproved, oppsPending, eventsApproved, eventsPending, momentsAll, projAll] = await Promise.allSettled([
        api.opportunities.list({ limit: 100 }),
        api.opportunities.list({ status: 'pending', limit: 100 }),
        api.events.list({ limit: 100 }),
        api.events.list({ status: 'pending', limit: 100 }),
        api.moments.list(100, 0, true),
        api.projects.list(undefined, true),
      ]);

      const oppMap = new Map<string, Opportunity>();
      if (oppsApproved.status === 'fulfilled' && oppsApproved.value?.data) {
        oppsApproved.value.data.forEach(o => oppMap.set(o.id, o));
      }
      if (oppsPending.status === 'fulfilled' && oppsPending.value?.data) {
        oppsPending.value.data.forEach(o => oppMap.set(o.id, o));
      }
      if (oppMap.size === 0) {
        dbStore.getOpportunities(true).forEach(o => oppMap.set(o.id, o));
      }
      const allOpps = Array.from(oppMap.values());
      setOpportunities(allOpps);
      dbStore.setOpportunities(allOpps);

      const eventMap = new Map<string, CommunityEvent>();
      if (eventsApproved.status === 'fulfilled' && eventsApproved.value?.data) {
        eventsApproved.value.data.forEach(e => eventMap.set(e.id, e));
      }
      if (eventsPending.status === 'fulfilled' && eventsPending.value?.data) {
        eventsPending.value.data.forEach(e => eventMap.set(e.id, e));
      }
      if (eventMap.size === 0) {
        dbStore.getEvents(true).forEach(e => eventMap.set(e.id, e));
      }
      const allEvents = Array.from(eventMap.values());
      setEvents(allEvents);
      dbStore.setEvents(allEvents);

      const momentMap = new Map<string, NirvanaMoment>();
      if (momentsAll.status === 'fulfilled' && momentsAll.value?.data) {
        momentsAll.value.data.forEach(m => momentMap.set(m.id, m));
      }
      if (momentMap.size === 0) {
        dbStore.getMoments(true).forEach(m => momentMap.set(m.id, m));
      }
      const allMoments = Array.from(momentMap.values());
      setMoments(allMoments);
      dbStore.setMoments(allMoments);

      const projMap = new Map<string, Project>();
      if (projAll.status === 'fulfilled' && projAll.value?.data) {
        projAll.value.data.forEach(p => projMap.set(p.id, p));
      }
      if (projMap.size === 0) {
        dbStore.getProjects(true).forEach(p => projMap.set(p.id, p));
      }
      const allProjects = Array.from(projMap.values());
      setProjects(allProjects);
      dbStore.setProjects(allProjects);

      setReports(dbStore.getReports());
    } catch (e) {
      console.error('Error refreshing moderation data:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const pendingOpps = opportunities.filter(o => o.status === 'pending');
  const pendingEvents = events.filter(e => e.status === 'pending');
  const pendingMoments = moments.filter(m => m.status === 'pending');
  const pendingProjects = projects.filter(p => p.approvalStatus === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');
  const totalPending = pendingOpps.length + pendingEvents.length + pendingMoments.length + pendingProjects.length + pendingReports.length;

  const approvedOpps = opportunities.filter(o => o.status === 'approved');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const approvedMoments = moments.filter(m => m.status === 'approved');
  const approvedProjects = projects.filter(p => p.approvalStatus === 'approved');
  const totalApproved = approvedOpps.length + approvedEvents.length + approvedMoments.length + approvedProjects.length;

  const handleApproveOpportunity = async (id: string) => {
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.opportunities.review(id, 'approved');
    dbStore.updateOpportunityStatus(id, 'approved', currentUser);
    await refreshData();
  };

  const handleRejectOpportunity = async (id: string) => {
    if (!currentUser) return;
    const reason = prompt('Enter reason for rejection (sent to submitter):', 'Does not meet compensation transparency guidelines');
    if (reason === null) return;
    soundEffects.playClick();
    await api.opportunities.review(id, 'rejected', reason);
    dbStore.updateOpportunityStatus(id, 'rejected', currentUser, reason);
    await refreshData();
  };

  const handleApproveEvent = async (id: string) => {
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.events.review(id, 'approved');
    dbStore.updateEventStatus(id, 'approved', currentUser);
    await refreshData();
  };

  const handleRejectEvent = async (id: string) => {
    if (!currentUser) return;
    const reason = prompt('Enter reason for rejection:', 'Unverified registration link');
    if (reason === null) return;
    soundEffects.playClick();
    await api.events.review(id, 'rejected', reason);
    dbStore.updateEventStatus(id, 'rejected', currentUser, reason);
    await refreshData();
  };

  const handleApproveMoment = async (id: string) => {
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.moments.review(id, 'approved');
    dbStore.updateMomentStatus(id, 'approved', currentUser);
    await refreshData();
  };

  const handleRejectMoment = async (id: string) => {
    if (!currentUser) return;
    const reason = prompt('Enter reason for rejection (sent to author):', 'Inappropriate or violates guidelines');
    if (reason === null) return;
    soundEffects.playClick();
    await api.moments.review(id, 'rejected', reason);
    dbStore.updateMomentStatus(id, 'rejected', currentUser, reason);
    await refreshData();
  };

  const handleApproveProject = async (id: string) => {
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.projects.review(id, 'approved');
    dbStore.updateProjectStatus(id, 'approved', currentUser);
    await refreshData();
  };

  const handleRejectProject = async (id: string) => {
    if (!currentUser) return;
    const reason = prompt('Enter reason for rejection (sent to submitter):', 'Incomplete repository or violates guidelines');
    if (reason === null) return;
    soundEffects.playClick();
    await api.projects.review(id, 'rejected', reason);
    dbStore.updateProjectStatus(id, 'rejected', currentUser, reason);
    await refreshData();
  };

  const handleResolveReport = async (id: string) => {
    if (!currentUser) return;
    soundEffects.playSuccess();
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolve_report', reportId: id }),
    }).catch(console.error);
    dbStore.updateReportStatus(id, 'resolved', currentUser);
    await refreshData();
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this opportunity?')) return;
    soundEffects.playClick();
    await api.opportunities.delete(id);
    dbStore.deleteOpportunity(id, currentUser);
    await refreshData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    soundEffects.playClick();
    await api.events.delete(id);
    dbStore.deleteEvent(id, currentUser);
    await refreshData();
  };

  const handleDeleteMoment = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this moment?')) return;
    soundEffects.playClick();
    await api.moments.delete(id);
    dbStore.deleteMoment(id, currentUser);
    await refreshData();
  };

  const handleDeleteProject = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    soundEffects.playClick();
    await api.projects.delete(id);
    dbStore.deleteProject(id, currentUser);
    await refreshData();
  };

  const handleSaveModal = async (updatedItem: any) => {
    if (!editingEntity || !currentUser) return;
    if (editingEntity.type === 'opportunity') {
      await api.opportunities.update(updatedItem.id, updatedItem);
      dbStore.updateOpportunity(updatedItem, currentUser);
    } else if (editingEntity.type === 'event') {
      await api.events.update(updatedItem.id, updatedItem);
      dbStore.updateEvent(updatedItem, currentUser);
    } else if (editingEntity.type === 'moment') {
      await api.moments.update(updatedItem.id, updatedItem);
      dbStore.updateMoment(updatedItem, currentUser);
    } else if (editingEntity.type === 'project') {
      await api.projects.update(updatedItem.id, updatedItem);
      dbStore.updateProject(updatedItem, currentUser);
    }
    await refreshData();
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

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-amber">
              <Clock size={13} /> Review Queue
            </span>
            <span className="badge badge-rose">ADMIN ACCESS ONLY</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px' }}>
            Content Moderation &amp; Approval Pipeline
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Approve, reject, or request revisions on user submissions across Community Moments, Projects, Opportunities, and Events. Approved items appear instantly across public feeds.
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            refreshData();
          }}
          disabled={isRefreshing}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-md)' }}
        >
          <RotateCw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Queue'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('all')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'all' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'all' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'all' ? 700 : 500,
          }}
        >
          All Pending ({totalPending})
        </button>

        <button
          onClick={() => setActiveTab('moments')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'moments' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'moments' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'moments' ? 700 : 500,
          }}
        >
          Moments ({pendingMoments.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'projects' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'projects' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'projects' ? 700 : 500,
          }}
        >
          Projects ({pendingProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'opportunities' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'opportunities' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'opportunities' ? 700 : 500,
          }}
        >
          Opportunities ({pendingOpps.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'events' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'events' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'events' ? 700 : 500,
          }}
        >
          Events ({pendingEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'reports' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'reports' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'reports' ? 700 : 500,
          }}
        >
          Flagged Reports ({pendingReports.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className="btn-ghost"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: activeTab === 'history' ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'history' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'history' ? 700 : 500,
          }}
        >
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
          Approved History ({totalApproved})
        </button>
      </div>

      {/* Main List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Pending Nirvana Moments */}
        {(activeTab === 'all' || activeTab === 'moments') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} /> Pending Nirvana Moments Submissions ({pendingMoments.length})
            </h3>

            {pendingMoments.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No community moments currently awaiting approval.
              </div>
            ) : (
              pendingMoments.map(moment => (
                <div
                  key={moment.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderLeft: '4px solid var(--accent-amber)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={moment.userAvatar}
                        alt={moment.userName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 700 }}>{moment.userName}</span>
                          <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                            PENDING APPROVAL
                          </span>
                          <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                            #{moment.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {moment.userTitle} • Submitted {moment.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingEntity({ type: 'moment', item: moment })}
                        className="btn-secondary"
                        title="Modify this moment"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMoment(moment.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '8px 10px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => handleRejectMoment(moment.id)}
                        className="btn-danger"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <X size={15} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveMoment(moment.id)}
                        className="btn-success"
                        style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <Check size={15} /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {moment.content}
                  </p>

                  {moment.imageUrl && (
                    <div style={{ maxWidth: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <img
                        src={moment.imageUrl}
                        alt="Moment attachment"
                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Projects Showcase */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-cyan)' }} /> Pending Project Hub Submissions ({pendingProjects.length})
            </h3>

            {pendingProjects.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No projects currently awaiting approval.
              </div>
            ) : (
              pendingProjects.map(proj => (
                <div
                  key={proj.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderLeft: '4px solid var(--accent-amber)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      {proj.coverImage && (
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{proj.title}</h4>
                          <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                            PENDING APPROVAL
                          </span>
                          <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                            {proj.category}
                          </span>
                          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                            {proj.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={proj.authorAvatar}
                            alt={proj.authorName}
                            style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                          />
                          <span>By {proj.authorName}</span>
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            >
                              GitHub <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingEntity({ type: 'project', item: proj })}
                        className="btn-secondary"
                        title="Modify this project"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '8px 10px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => handleRejectProject(proj.id)}
                        className="btn-danger"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <X size={15} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveProject(proj.id)}
                        className="btn-success"
                        style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <Check size={15} /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="badge" style={{ fontSize: '0.72rem' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Opportunities */}
        {(activeTab === 'all' || activeTab === 'opportunities') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} style={{ color: 'var(--accent-cyan)' }} /> Pending Opportunity Submissions
            </h3>

            {pendingOpps.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No opportunities currently awaiting approval.
              </div>
            ) : (
              pendingOpps.map(opp => (
                <div
                  key={opp.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderLeft: '4px solid var(--accent-amber)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                        PENDING APPROVAL
                      </span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        {opp.title} @ {opp.company}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Submitted by: {opp.postedBy.name} • Compensation: {opp.stipendOrSalary} • Location: {opp.location}
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingEntity({ type: 'opportunity', item: opp })}
                        className="btn-secondary"
                        title="Modify this opportunity"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '8px 10px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => handleRejectOpportunity(opp.id)}
                        className="btn-danger"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <X size={15} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveOpportunity(opp.id)}
                        className="btn-success"
                        style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <Check size={15} /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {opp.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {opp.skills.map((s, i) => (
                      <span key={i} className="badge" style={{ fontSize: '0.72rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Events */}
        {(activeTab === 'all' || activeTab === 'events') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--accent-amber)' }} /> Pending Event Submissions
            </h3>

            {pendingEvents.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No events currently awaiting approval.
              </div>
            ) : (
              pendingEvents.map(evt => (
                <div
                  key={evt.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderLeft: '4px solid var(--accent-amber)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                        PENDING APPROVAL
                      </span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        {evt.title}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Organizer: {evt.organizer} • Date: {evt.date} • Submitter: {evt.postedBy.name}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingEntity({ type: 'event', item: evt })}
                        className="btn-secondary"
                        title="Modify this event"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '8px 10px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => handleRejectEvent(evt.id)}
                        className="btn-danger"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <X size={15} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveEvent(evt.id)}
                        className="btn-success"
                        style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <Check size={15} /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {evt.description}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Flagged Reports */}
        {(activeTab === 'all' || activeTab === 'reports') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} /> Content Moderation Reports
            </h3>

            {pendingReports.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No active user reports.
              </div>
            ) : (
              pendingReports.map(rep => (
                <div
                  key={rep.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderLeft: '4px solid var(--accent-rose)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-rose">{rep.reason}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Reported by {rep.reportedByName}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{rep.targetTitle}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {rep.details}
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                  >
                    Mark Resolved
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Approved History */}
        {activeTab === 'history' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} /> Approved &amp; Published Submissions ({totalApproved})
            </h3>

            {totalApproved === 0 ? (
              <div className="glass-card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No approved submissions found in database.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Approved Opportunities */}
                {approvedOpps.map(opp => (
                  <div
                    key={opp.id}
                    className="glass-card"
                    style={{
                      padding: '20px 24px',
                      borderLeft: '4px solid var(--accent-emerald)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          <Check size={12} /> APPROVED &amp; PUBLISHED
                        </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          Opportunity ({opp.type})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {opp.title} @ {opp.company}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Submitted by: {opp.postedBy.name} • Location: {opp.location} • Compensation: {opp.stipendOrSalary}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href="/opportunities"
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        View Live <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => setEditingEntity({ type: 'opportunity', item: opp })}
                        className="btn-secondary"
                        title="Modify this opportunity"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRejectOpportunity(opp.id)}
                        className="btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Revoke Approval
                      </button>
                    </div>
                  </div>
                ))}

                {/* Approved Events */}
                {approvedEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="glass-card"
                    style={{
                      padding: '20px 24px',
                      borderLeft: '4px solid var(--accent-emerald)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          <Check size={12} /> APPROVED &amp; PUBLISHED
                        </span>
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          Event ({evt.category})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{evt.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Organizer: {evt.organizer} • Date: {evt.date} • Submitted by: {evt.postedBy.name}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href="/events"
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        View Live <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => setEditingEntity({ type: 'event', item: evt })}
                        className="btn-secondary"
                        title="Modify this event"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRejectEvent(evt.id)}
                        className="btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Revoke Approval
                      </button>
                    </div>
                  </div>
                ))}

                {/* Approved Moments */}
                {approvedMoments.map(m => (
                  <div
                    key={m.id}
                    className="glass-card"
                    style={{
                      padding: '20px 24px',
                      borderLeft: '4px solid var(--accent-emerald)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          <Check size={12} /> APPROVED &amp; PUBLISHED
                        </span>
                        <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                          Moment (#{m.category})
                        </span>
                      </div>
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '4px 0' }}>
                        {m.content}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        By {m.userName} • {m.createdAt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href="/moments"
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        View Live <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => setEditingEntity({ type: 'moment', item: m })}
                        className="btn-secondary"
                        title="Modify this moment"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMoment(m.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRejectMoment(m.id)}
                        className="btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Revoke Approval
                      </button>
                    </div>
                  </div>
                ))}

                {/* Approved Projects */}
                {approvedProjects.map(p => (
                  <div
                    key={p.id}
                    className="glass-card"
                    style={{
                      padding: '20px 24px',
                      borderLeft: '4px solid var(--accent-emerald)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          <Check size={12} /> APPROVED &amp; PUBLISHED
                        </span>
                        <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                          Project ({p.category})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{p.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        By {p.authorName} • Tech: {p.techStack.join(', ')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href="/projects"
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        View Live <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => setEditingEntity({ type: 'project', item: p })}
                        className="btn-secondary"
                        title="Modify this project"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="btn-ghost"
                        title="Permanently Delete"
                        style={{ padding: '6px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRejectProject(p.id)}
                        className="btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Revoke Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* In-Place Admin Edit Modal */}
      <AdminEditModal
        isOpen={Boolean(editingEntity)}
        onClose={() => setEditingEntity(null)}
        type={editingEntity?.type || 'opportunity'}
        item={editingEntity?.item}
        onSave={handleSaveModal}
      />
    </div>
  );
}
