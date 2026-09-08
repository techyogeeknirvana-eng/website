'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Trophy, 
  Rocket, 
  Award, 
  PlusCircle, 
  Image as ImageIcon,
  Flame,
  Clock,
  CheckCircle2,
  Check,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { NirvanaMoment } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

export default function NirvanaMomentsPage() {
  const { currentUser, isAdmin } = useAuth();
  const [moments, setMoments] = useState<NirvanaMoment[]>([]);
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NirvanaMoment['category']>('all');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string>('');
  const [editingMoment, setEditingMoment] = useState<NirvanaMoment | null>(null);

  useEffect(() => {
    setMoments(dbStore.getMoments(isAdmin, currentUser?.id));
  }, [currentUser, isAdmin]);

  // AI auto-categorization when creating a moment
  const inferCategory = (text: string): NirvanaMoment['category'] => {
    const t = text.toLowerCase();
    if (t.includes('hackathon') || t.includes('won') || t.includes('prize') || t.includes('1st')) return 'HackathonWin';
    if (t.includes('launched') || t.includes('shipped') || t.includes('release') || t.includes('built')) return 'ProjectLaunch';
    if (t.includes('offer') || t.includes('internship') || t.includes('joined') || t.includes('hired')) return 'InternshipOffer';
    if (t.includes('certified') || t.includes('paper') || t.includes('accepted') || t.includes('exam')) return 'Certification';
    return 'TechDiscovery';
  };

  const handlePostMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !postContent.trim()) return;

    soundEffects.playSuccess();
    const autoCat = inferCategory(postContent);

    dbStore.addMoment(
      {
        content: postContent.trim(),
        category: autoCat,
        imageUrl: postContent.includes('hackathon') ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' : undefined,
      },
      currentUser
    );

    setMoments(dbStore.getMoments(isAdmin, currentUser.id));
    setPostContent('');

    if (isAdmin) {
      setSubmittedNotice('🚀 Moment published directly to community feed!');
    } else {
      setSubmittedNotice('⏳ Moment submitted for Admin Review! It will appear on the public feed once approved by an administrator.');
    }
    setTimeout(() => setSubmittedNotice(''), 9000);
  };

  const handleApprove = async (id: string) => {
    if (!currentUser || !isAdmin) return;
    soundEffects.playSuccess();
    try {
      await api.moments.review(id, 'approved');
    } catch (_) {}
    dbStore.updateMomentStatus(id, 'approved', currentUser);
    setMoments(dbStore.getMoments(isAdmin, currentUser.id));
  };

  const handleReject = async (id: string) => {
    if (!currentUser || !isAdmin) return;
    const reason = prompt('Reason for rejection (optional):', 'Does not meet community guidelines');
    if (reason === null) return;
    soundEffects.playClick();
    try {
      await api.moments.review(id, 'rejected', reason);
    } catch (_) {}
    dbStore.updateMomentStatus(id, 'rejected', currentUser, reason);
    setMoments(dbStore.getMoments(isAdmin, currentUser.id));
  };

  const handleDeleteMoment = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser || !isAdmin) return;
    if (!confirm('Are you sure you want to permanently delete this moment?')) return;
    soundEffects.playClick();
    try {
      await api.moments.delete(id);
    } catch (_) {}
    dbStore.deleteMoment(id, currentUser);
    setMoments(prev => prev.filter(m => m.id !== id));
  };

  const handleSaveMoment = async (updated: NirvanaMoment) => {
    if (!currentUser || !isAdmin) return;
    try {
      await api.moments.update(updated.id, updated);
    } catch (_) {}
    dbStore.updateMoment(updated, currentUser);
    setMoments(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleLike = (id: string) => {
    if (!currentUser) return;
    soundEffects.playClick();
    dbStore.toggleLikeMoment(id, currentUser.id);
    setMoments([...dbStore.getMoments(isAdmin, currentUser.id)]);
  };

  const handleAddComment = (momentId: string) => {
    if (!currentUser || !commentInput.trim()) return;
    soundEffects.playClick();
    dbStore.addCommentMoment(momentId, commentInput.trim(), currentUser);
    setMoments([...dbStore.getMoments(isAdmin, currentUser.id)]);
    setCommentInput('');
    setActiveCommentId(null);
  };

  const filtered = selectedCategory === 'all'
    ? moments
    : moments.filter(m => m.category === selectedCategory);

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
          Community Milestone Feed
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Nirvana Moments
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Celebrate wins, project launches, internship offers, and breakthroughs with fellow builders.
        </p>
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

      {/* Share a Moment Input Card */}
      {currentUser && (
        <div
          className="glass-card glow-border"
          style={{
            padding: '24px',
            marginBottom: '32px',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AI auto-categorizes your post as you type!
              </div>
            </div>
          </div>

          <form onSubmit={handlePostMoment}>
            <textarea
              rows={3}
              placeholder="What milestone did you achieve today? (Hackathon win, project launch, offer, certification...)"
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              className="input-custom"
              style={{ resize: 'none', marginBottom: '14px' }}
            />

            {postContent.trim() && (
              <div style={{ marginBottom: '12px', fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> AI Detected Category: #{inferCategory(postContent)}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Earn +45 XP per moment shared
              </span>

              <button
                type="submit"
                disabled={!postContent.trim()}
                className="btn btn-primary"
                style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)' }}
              >
                Publish Moment <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
        {[
          { id: 'all', label: 'All Moments' },
          { id: 'HackathonWin', label: '🏆 Hackathon Wins' },
          { id: 'ProjectLaunch', label: '🚀 Project Launches' },
          { id: 'InternshipOffer', label: '💼 Offers' },
          { id: 'Certification', label: '📜 Milestones' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory(cat.id as typeof selectedCategory);
            }}
            className="btn-ghost"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              background: selectedCategory === cat.id ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat.id ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filtered.map(moment => {
          const isLiked = currentUser && moment.likedBy.includes(currentUser.id);

          return (
            <div
              key={moment.id}
              className="glass-card"
              style={{ padding: '26px', borderRadius: 'var(--radius-lg)' }}
            >
              {/* Approval status banner if pending or rejected */}
              {moment.status === 'pending' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(234, 179, 8, 0.12)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    color: '#facc15',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    <span>⏳ PENDING ADMIN APPROVAL (Visible only to you and moderators)</span>
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleApprove(moment.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#16a34a' }}
                      >
                        <Check size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(moment.id)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                      >
                        <X size={13} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
              {moment.status === 'rejected' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={16} />
                    <span>❌ REJECTED BY MODERATOR: {moment.rejectionReason || 'Does not meet guidelines'}</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={moment.userAvatar}
                    alt={moment.userName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{moment.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {moment.userTitle} • {moment.createdAt}
                    </div>
                  </div>
                </div>

                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                  #{moment.category}
                </span>
              </div>

              <p style={{ fontSize: '0.94rem', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                {moment.content}
              </p>

              {moment.imageUrl && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px', maxHeight: '360px' }}>
                  <img
                    src={moment.imageUrl}
                    alt="Moment"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Action Reactions Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => handleLike(moment.id)}
                  className="btn-ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: isLiked ? 'var(--accent-rose)' : 'var(--text-secondary)',
                  }}
                >
                  <Heart size={18} fill={isLiked ? 'var(--accent-rose)' : 'none'} />
                  <span>{moment.likesCount}</span>
                </button>

                <button
                  onClick={() => setActiveCommentId(activeCommentId === moment.id ? null : moment.id)}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <MessageCircle size={18} />
                  <span>{moment.comments.length} Comments</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    alert('Moment link copied!');
                  }}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Admin Direct Controls */}
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
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className={
                        moment.status === 'approved'
                          ? 'badge badge-emerald'
                          : moment.status === 'rejected'
                          ? 'badge badge-rose'
                          : 'badge badge-amber'
                      }
                      style={{ fontSize: '0.68rem' }}
                    >
                      {moment.status?.toUpperCase() || 'APPROVED'}
                    </span>
                    {moment.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(moment.id)}
                        className="btn-success"
                        style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px' }}
                      >
                        Allow
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setEditingMoment(moment)}
                      className="btn-secondary"
                      title="Modify Moment"
                      style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={e => handleDeleteMoment(moment.id, e)}
                      className="btn-ghost"
                      title="Delete Moment"
                      style={{ padding: '4px 8px', fontSize: '0.74rem', borderRadius: '4px', color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {activeCommentId === moment.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <input
                      type="text"
                      placeholder="Write a congratulatory comment..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddComment(moment.id);
                      }}
                      className="input-custom"
                      style={{ fontSize: '0.84rem' }}
                    />
                    <button
                      onClick={() => handleAddComment(moment.id)}
                      className="btn btn-primary"
                      style={{ padding: '8px 14px' }}
                    >
                      <Send size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {moment.comments.map(c => (
                      <div
                        key={c.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.userName}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.createdAt}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>{c.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Edit Modal */}
      {editingMoment && (
        <AdminEditModal
          isOpen={Boolean(editingMoment)}
          onClose={() => setEditingMoment(null)}
          type="moment"
          item={editingMoment}
          onSave={handleSaveMoment}
        />
      )}
    </div>
  );
}
