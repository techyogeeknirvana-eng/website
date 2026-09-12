'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  Search, 
  Code, 
  CheckCircle2,
  Clock,
  Check,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { GithubIcon } from '@/components/common/BrandIcons';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { Project } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

export default function ProjectsPage() {
  const { currentUser, isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string>('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjectsFromServer = async () => {
    try {
      const res = await api.projects.list(selectedCategory, true);
      const items = res.data;
      if (items && Array.isArray(items)) {
        dbStore.setProjects(items);
        setProjects(prev => {
          const projMap = new Map<string, Project>();
          prev.forEach(p => projMap.set(p.id, p));
          items.forEach((p: Project) => projMap.set(p.id, p));
          return Array.from(projMap.values()).sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    } catch (_) {}
  };

  useEffect(() => {
    setProjects(dbStore.getProjects(isAdmin, currentUser?.id));
    fetchProjectsFromServer();

    // 4s polling loop for cross-account synchronization
    const interval = setInterval(fetchProjectsFromServer, 4000);

    const onFocus = () => {
      fetchProjectsFromServer();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [currentUser, isAdmin, selectedCategory]);

  // New Project Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('TypeScript, Next.js, Tailwind CSS');
  const [githubUrl, setGithubUrl] = useState('https://github.com/');
  const [liveUrl, setLiveUrl] = useState('https://');
  const [category, setCategory] = useState<Project['category']>('AI');
  const [status, setStatus] = useState<Project['status']>('Beta');

  const categories = ['All', 'AI', 'Web', 'Mobile', 'Cybersecurity', 'Open Source'];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    soundEffects.playClick();
    dbStore.toggleLikeProject(id, currentUser.id);
    setProjects([...dbStore.getProjects(isAdmin, currentUser.id)]);
  };

  const handleApproveProject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser || !isAdmin) return;
    soundEffects.playSuccess();
    try {
      await api.projects.review(id, 'approved');
    } catch (_) {}
    dbStore.updateProjectStatus(id, 'approved', currentUser);
    setProjects(dbStore.getProjects(isAdmin, currentUser.id));
  };

  const handleRejectProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser || !isAdmin) return;
    const reason = prompt('Reason for rejection (optional):', 'Does not meet showcase guidelines');
    if (reason === null) return;
    soundEffects.playClick();
    dbStore.updateProjectStatus(id, 'rejected', currentUser, reason);
    setProjects(dbStore.getProjects(isAdmin, currentUser.id));
  };

  const handleDeleteProject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser || !isAdmin) return;
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    soundEffects.playClick();
    try {
      await api.projects.delete(id);
    } catch (_) {}
    dbStore.deleteProject(id, currentUser);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProject = async (updated: Project) => {
    if (!currentUser || !isAdmin) return;
    try {
      await api.projects.update(updated.id, updated);
    } catch (_) {}
    dbStore.updateProject(updated, currentUser);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    soundEffects.playSuccess();

    const created = dbStore.addProject(
      {
        title,
        description,
        techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
        githubUrl,
        liveUrl: liveUrl.trim() !== 'https://' ? liveUrl : undefined,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        category,
        status,
      },
      currentUser
    );

    setProjects(prev => {
      const map = new Map<string, Project>();
      map.set(created.id, created);
      prev.forEach(p => map.set(p.id, p));
      return Array.from(map.values());
    });
    setModalOpen(false);
    setTitle('');
    setDescription('');

    const isNowAdmin = currentUser.role === 'ADMIN';
    setSubmittedNotice(
      isNowAdmin
        ? '🚀 Project published directly to showcase!'
        : '⏳ Project submitted for Admin Approval! It is visible to you below with a "Pending" badge and will be publicly published to everyone once approved.'
    );
    setTimeout(() => setSubmittedNotice(''), 9000);
  };

  const filtered = projects.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchStack = p.techStack.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchStack) return false;
    }
    return true;
  });

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
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            Developer Showcase
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Project Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Discover open source repos, AI tools, and student hackathon prototypes built by the community.
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
          <Plus size={18} /> Showcase a Project
        </button>
      </div>

      {/* Submitted Notice Banner */}
      {submittedNotice && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: '24px',
            borderRadius: 'var(--radius-md)',
            background: submittedNotice.includes('🚀') ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.12)',
            border: submittedNotice.includes('🚀') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
            color: submittedNotice.includes('🚀') ? '#4ade80' : '#facc15',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {submittedNotice.includes('🚀') ? <CheckCircle2 size={18} /> : <Clock size={18} />}
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Category Pills & Search */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundEffects.playClick();
                setSelectedCategory(cat);
              }}
              className="btn-ghost"
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                background: selectedCategory === cat ? 'var(--gradient-nirvana)' : 'transparent',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

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
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.86rem',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {filtered.map(proj => {
          const isLiked = currentUser && proj.likedBy.includes(currentUser.id);

          return (
            <div
              key={proj.id}
              className="glass-card glass-card-interactive"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Moderation status banner */}
                {proj.approvalStatus === 'pending' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(234, 179, 8, 0.92)',
                      color: '#000',
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 3,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>⏳ PENDING ADMIN APPROVAL</span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleApproveProject(proj.id);
                          }}
                          style={{
                            border: 'none',
                            background: '#15803d',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleRejectProject(proj.id);
                          }}
                          style={{
                            border: 'none',
                            background: '#b91c1c',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {proj.approvalStatus === 'rejected' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      zIndex: 3,
                    }}
                  >
                    ❌ REJECTED: {proj.rejectionReason || 'Declined'}
                  </div>
                )}

                <span
                  className="badge badge-indigo"
                  style={{ position: 'absolute', top: proj.approvalStatus === 'pending' || proj.approvalStatus === 'rejected' ? '40px' : '12px', left: '12px', fontWeight: 700 }}
                >
                  {proj.category}
                </span>
                <span
                  className="badge badge-emerald"
                  style={{ position: 'absolute', top: proj.approvalStatus === 'pending' || proj.approvalStatus === 'rejected' ? '40px' : '12px', right: '12px', fontWeight: 600 }}
                >
                  {proj.status}
                </span>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {proj.techStack.map((t, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: '0.72rem' }}>
                        {t}
                      </span>
                    ))}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={proj.authorAvatar}
                      alt={proj.authorName}
                      style={{ width: '26px', height: '26px', borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{proj.authorName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={e => handleLike(proj.id, e)}
                      className="btn-ghost"
                      style={{ padding: '6px 8px', fontSize: '0.8rem', color: isLiked ? 'var(--accent-rose)' : 'var(--text-muted)' }}
                    >
                      <Heart size={15} fill={isLiked ? 'var(--accent-rose)' : 'none'} />
                      <span style={{ marginLeft: '4px' }}>{proj.likes}</span>
                    </button>

                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ padding: '6px' }}
                    >
                      <GithubIcon size={16} />
                    </a>

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ padding: '6px', color: 'var(--accent-cyan)' }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Admin Direct Controls on Card */}
                {isAdmin && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        className={
                          proj.approvalStatus === 'approved'
                            ? 'badge badge-emerald'
                            : proj.approvalStatus === 'rejected'
                            ? 'badge badge-rose'
                            : 'badge badge-amber'
                        }
                        style={{ fontSize: '0.68rem' }}
                      >
                        {proj.approvalStatus?.toUpperCase() || 'APPROVED'}
                      </span>
                      {proj.approvalStatus !== 'approved' && (
                        <button
                          onClick={e => handleApproveProject(proj.id, e)}
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
                          setEditingProject(proj);
                        }}
                        className="btn-secondary"
                        title="Modify Project"
                        style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={e => handleDeleteProject(proj.id, e)}
                        className="btn-ghost"
                        title="Delete Project"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '4px', color: '#ef4444' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Project Modal */}
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Showcase Your Project</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add your open-source build, web app, or hackathon prototype.
            </p>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitPulse AI Copilot"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Project['category'])}
                    className="input-custom"
                    style={{ background: '#0d121d' }}
                  >
                    <option value="AI">AI</option>
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as Project['status'])}
                    className="input-custom"
                    style={{ background: '#0d121d' }}
                  >
                    <option value="Beta">Beta</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Tech Stack (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Short Pitch &amp; Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="input-custom"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
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
                  Publish Project (+75 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingProject && (
        <AdminEditModal
          isOpen={Boolean(editingProject)}
          onClose={() => setEditingProject(null)}
          type="project"
          item={editingProject}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}
