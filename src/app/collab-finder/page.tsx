'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Send, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { CollabRequest } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function CollabFinderPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<CollabRequest[]>(dbStore.getCollabRequests());
  const [modalOpen, setModalOpen] = useState(false);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [hackathonOrProject, setHackathonOrProject] = useState('Nirvana Global Hackathon 2026');
  const [roleNeeded, setRoleNeeded] = useState('Frontend & UI Specialist');
  const [requiredSkills, setRequiredSkills] = useState('React, Tailwind CSS, TypeScript');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('March 18, 2026');

  const handleCreateCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    soundEffects.playSuccess();

    const created = dbStore.addCollabRequest(
      {
        title,
        organizerId: currentUser.id,
        organizerName: currentUser.name,
        organizerAvatar: currentUser.avatar,
        organizerRole: currentUser.title,
        hackathonOrProject,
        roleNeeded,
        requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        description,
        deadline,
      },
      currentUser
    );

    setRequests(prev => [created, ...prev]);
    setModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleApply = (id: string) => {
    soundEffects.playSuccess();
    setAppliedIds(prev => [...prev, id]);
    alert('Collaboration request sent! The organizer has been notified on the platform.');
  };

  // Calculate AI Compatibility Match
  const calculateCompatibility = (req: CollabRequest) => {
    if (!currentUser) return 82;
    const userSkills = (currentUser.skills || []).map((s: string) => s.toLowerCase());
    const matched = req.requiredSkills.filter((s: string) => userSkills.some((us: string) => us.includes(s.toLowerCase())));
    const ratio = matched.length / Math.max(1, req.requiredSkills.length);
    return Math.min(98, Math.max(65, Math.round(65 + ratio * 32)));
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '36px',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
            Teammate Matchmaking
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Collab Finder
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Find talented co-builders for upcoming hackathons, open source initiatives, and startup projects.
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ padding: '12px 22px' }}
        >
          <Plus size={18} /> Post a Teammate Request
        </button>
      </div>

      {/* Collab Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {requests.map(req => {
          const compat = calculateCompatibility(req);
          const hasApplied = appliedIds.includes(req.id);

          return (
            <div
              key={req.id}
              className="glass-card glass-card-interactive"
              style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={req.organizerAvatar}
                      alt={req.organizerName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{req.organizerName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{req.organizerRole}</div>
                    </div>
                  </div>

                  <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    <Sparkles size={11} /> {compat}% MATCH
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                  {req.hackathonOrProject}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>
                  {req.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                  {req.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Role Needed: <strong style={{ color: 'var(--text-primary)' }}>{req.roleNeeded}</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {req.requiredSkills.map((s, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: '0.72rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Deadline: {req.deadline}
                </div>

                <button
                  onClick={() => handleApply(req.id)}
                  disabled={hasApplied}
                  className={hasApplied ? 'btn-success' : 'btn-primary'}
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  {hasApplied ? 'Request Sent ✓' : 'Connect / Request to Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Collab Request */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '560px',
              width: '100%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Find a Teammate</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Describe what role you need filled and your project scope.
            </p>

            <form onSubmit={handleCreateCollab} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Request Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need a UI/UX Designer for Nirvana Hackathon"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Hackathon / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={hackathonOrProject}
                  onChange={e => setHackathonOrProject(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Role Needed *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Frontend Lead, Smart Contract Dev"
                  value={roleNeeded}
                  onChange={e => setRoleNeeded(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Required Skills (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={requiredSkills}
                  onChange={e => setRequiredSkills(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Project Description &amp; Pitch *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What is your team building and what are you looking for in a teammate?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  Publish Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
