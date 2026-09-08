'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Shield, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { Opportunity, CommunityEvent, Project, NirvanaMoment, User } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'opportunity' | 'event' | 'project' | 'moment' | 'user';
  item: any;
  onSave: (updated: any) => Promise<void>;
}

export function AdminEditModal({ isOpen, onClose, type, item, onSave }: AdminEditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setErrorMsg('');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (val: string) => {
    const list = val.split(',').map(s => s.trim()).filter(Boolean);
    handleChange('skills', list);
  };

  const handleTechStackChange = (val: string) => {
    const list = val.split(',').map(s => s.trim()).filter(Boolean);
    handleChange('techStack', list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      soundEffects.playSuccess();
      await onSave(formData);
      onClose();
    } catch (err: any) {
      soundEffects.playClick();
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'opportunity': return 'Modify Opportunity';
      case 'event': return 'Modify Community Event';
      case 'project': return 'Modify Project Showcase';
      case 'moment': return 'Modify Social Moment';
      case 'user': return 'Modify User Profile & Permissions';
      default: return 'Admin Modify Entity';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.15)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-rose)',
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{getTitle()}</h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Administrator Override &amp; Live In-Place Editor
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Opportunity Form Fields */}
          {type === 'opportunity' && (
            <>
              <div>
                <label className="label-custom">Job / Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={e => handleChange('company', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Opportunity Type</label>
                  <select
                    value={formData.type || 'internship'}
                    onChange={e => handleChange('type', e.target.value)}
                    className="input-custom"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Full-time Job</option>
                    <option value="freelance">Freelance Contract</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => handleChange('location', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Stipend / Salary Range</label>
                  <input
                    type="text"
                    value={formData.stipendOrSalary || ''}
                    onChange={e => handleChange('stipendOrSalary', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Apply Link / URL</label>
                  <input
                    type="url"
                    value={formData.applyUrl || ''}
                    onChange={e => handleChange('applyUrl', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Application Deadline</label>
                  <input
                    type="text"
                    value={formData.deadline || ''}
                    onChange={e => handleChange('deadline', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div>
                <label className="label-custom">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={(formData.skills || []).join(', ')}
                  onChange={e => handleSkillsChange(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label className="label-custom">Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-custom"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isRemote)}
                    onChange={e => handleChange('isRemote', e.target.checked)}
                  />
                  Remote Friendly / Work from Anywhere
                </label>

                <div>
                  <label className="label-custom" style={{ display: 'inline', marginRight: '8px' }}>Status:</label>
                  <select
                    value={formData.status || 'approved'}
                    onChange={e => handleChange('status', e.target.value)}
                    style={{ padding: '4px 10px', borderRadius: '6px', background: '#121422', color: '#fff', border: '1px solid #334155' }}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Event Form Fields */}
          {type === 'event' && (
            <>
              <div>
                <label className="label-custom">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Organizer / Club</label>
                  <input
                    type="text"
                    required
                    value={formData.organizer || ''}
                    onChange={e => handleChange('organizer', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Category</label>
                  <select
                    value={formData.category || 'Hackathons'}
                    onChange={e => handleChange('category', e.target.value)}
                    className="input-custom"
                  >
                    <option value="Hackathons">Hackathons</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Webinars">Webinars</option>
                    <option value="Tech Talks">Tech Talks</option>
                    <option value="Coding Competitions">Coding Competitions</option>
                    <option value="Conferences">Conferences</option>
                    <option value="College Events">College Events</option>
                    <option value="AI Events">AI Events</option>
                    <option value="Career Events">Career Events</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Event Date</label>
                  <input
                    type="text"
                    value={formData.date || ''}
                    onChange={e => handleChange('date', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Event Time</label>
                  <input
                    type="text"
                    value={formData.time || ''}
                    onChange={e => handleChange('time', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Location / Venue</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => handleChange('location', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Registration URL</label>
                  <input
                    type="url"
                    value={formData.registrationUrl || ''}
                    onChange={e => handleChange('registrationUrl', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div>
                <label className="label-custom">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerImage || ''}
                  onChange={e => handleChange('bannerImage', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label className="label-custom">Description &amp; Highlights</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-custom"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isOnline)}
                    onChange={e => handleChange('isOnline', e.target.checked)}
                  />
                  Online / Virtual Event
                </label>

                <div>
                  <label className="label-custom" style={{ display: 'inline', marginRight: '8px' }}>Status:</label>
                  <select
                    value={formData.status || 'approved'}
                    onChange={e => handleChange('status', e.target.value)}
                    style={{ padding: '4px 10px', borderRadius: '6px', background: '#121422', color: '#fff', border: '1px solid #334155' }}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Project Form Fields */}
          {type === 'project' && (
            <>
              <div>
                <label className="label-custom">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Category</label>
                  <select
                    value={formData.category || 'Web'}
                    onChange={e => handleChange('category', e.target.value)}
                    className="input-custom"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Web">Web Development</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="IoT">IoT & Hardware</option>
                    <option value="Blockchain">Blockchain / Web3</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
                <div>
                  <label className="label-custom">Project Stage</label>
                  <select
                    value={formData.status || 'In Progress'}
                    onChange={e => handleChange('status', e.target.value)}
                    className="input-custom"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Beta">Beta Release</option>
                    <option value="Production">Production Live</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={e => handleChange('githubUrl', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Live Demo Link</label>
                  <input
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={e => handleChange('liveUrl', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div>
                <label className="label-custom">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={(formData.techStack || []).join(', ')}
                  onChange={e => handleTechStackChange(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label className="label-custom">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage || ''}
                  onChange={e => handleChange('coverImage', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label className="label-custom">Project Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-custom"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="label-custom" style={{ display: 'inline', marginRight: '8px' }}>Approval Status:</label>
                <select
                  value={formData.approvalStatus || 'approved'}
                  onChange={e => handleChange('approvalStatus', e.target.value)}
                  style={{ padding: '4px 10px', borderRadius: '6px', background: '#121422', color: '#fff', border: '1px solid #334155' }}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </>
          )}

          {/* Moment Form Fields */}
          {type === 'moment' && (
            <>
              <div>
                <label className="label-custom">Moment Category</label>
                <select
                  value={formData.category || 'TechDiscovery'}
                  onChange={e => handleChange('category', e.target.value)}
                  className="input-custom"
                >
                  <option value="HackathonWin">🏆 Hackathon Win</option>
                  <option value="ProjectLaunch">🚀 Project Launch</option>
                  <option value="InternshipOffer">💼 Internship / Job Offer</option>
                  <option value="Certification">📜 Certification Earned</option>
                  <option value="TechDiscovery">💡 Tech Discovery</option>
                </select>
              </div>

              <div>
                <label className="label-custom">Moment Content / Post</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content || ''}
                  onChange={e => handleChange('content', e.target.value)}
                  className="input-custom"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="label-custom">Attached Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={e => handleChange('imageUrl', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label className="label-custom" style={{ display: 'inline', marginRight: '8px' }}>Status:</label>
                <select
                  value={formData.status || 'approved'}
                  onChange={e => handleChange('status', e.target.value)}
                  style={{ padding: '4px 10px', borderRadius: '6px', background: '#121422', color: '#fff', border: '1px solid #334155' }}
                >
                  <option value="approved">Approved &amp; Live</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </>
          )}

          {/* User Form Fields */}
          {type === 'user' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => handleChange('name', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username || ''}
                    onChange={e => handleChange('username', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">Platform Role</label>
                  <select
                    value={formData.role || 'USER'}
                    onChange={e => handleChange('role', e.target.value)}
                    className="input-custom"
                  >
                    <option value="USER">Student Member (USER)</option>
                    <option value="ADMIN">Platform Administrator (ADMIN)</option>
                  </select>
                </div>
                <div>
                  <label className="label-custom">Professional Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => handleChange('title', e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-custom">College / Company</label>
                  <input
                    type="text"
                    value={formData.collegeOrCompany || ''}
                    onChange={e => handleChange('collegeOrCompany', e.target.value)}
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="label-custom">Experience Level</label>
                  <select
                    value={formData.experienceLevel || 'Beginner'}
                    onChange={e => handleChange('experienceLevel', e.target.value)}
                    className="input-custom"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Innovator">Innovator</option>
                    <option value="Tech Titan">Tech Titan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-custom">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="input-custom"
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isSuspended)}
                    onChange={e => handleChange('isSuspended', e.target.checked)}
                  />
                  Account Suspended (Banned)
                </label>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: '8px 22px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} />
              {isSubmitting ? 'Saving Changes...' : 'Save & Overwrite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
