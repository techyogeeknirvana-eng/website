'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Building, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SubmitOpportunityPage() {
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<'job' | 'internship' | 'freelance' | 'hackathon'>('internship');
  const [location, setLocation] = useState('Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [experience, setExperience] = useState('0 - 1 years / Students');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹45,000 / month');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Node.js');
  const [description, setDescription] = useState('');
  const [applyUrl, setApplyUrl] = useState('https://');
  const [deadline, setDeadline] = useState('2026-10-30');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in or select a profile first.');
      return;
    }

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    dbStore.addOpportunity(
      {
        title,
        company,
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        type,
        location,
        isRemote,
        experience,
        stipendOrSalary,
        skills,
        description,
        applyUrl,
        deadline,
      },
      currentUser
    );

    soundEffects.playSuccess();
    setSubmittedSuccess(true);
  };

  return (
    <ProtectedRoute>
      <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '780px' }}>
      <button
        onClick={() => router.back()}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      {submittedSuccess ? (
        <div
          className="glass-card glow-border"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
            }}
          >
            <CheckCircle2 size={36} color="#10b981" />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
            Opportunity Submitted Successfully!
          </h2>

          <div
            className="badge badge-amber"
            style={{ fontSize: '0.85rem', padding: '6px 14px', marginBottom: '20px' }}
          >
            <Clock size={15} /> STATUS: {isAdmin ? 'APPROVED (ADMIN AUTO-PUBLISH)' : 'PENDING ADMIN APPROVAL'}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 28px auto' }}>
            {isAdmin
              ? 'As an Admin, your submission has been automatically published to the live opportunities marketplace.'
              : 'Your submission has been queued into the Admin Moderation Queue. Techyogeek Nirvana administrators review all listings for legitimacy, spam prevention, and fair compensation standards before public publishing.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/opportunities')}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              Back to Opportunities
            </button>
            <button
              onClick={() => router.push('/admin/moderation')}
              className="btn btn-secondary"
              style={{ padding: '12px 24px' }}
            >
              View Admin Moderation Queue
            </button>
          </div>
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: '36px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              Submission Pipeline
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Submit an Opportunity</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.92rem' }}>
              Share full-time jobs, summer internships, or hackathons with 24,000+ top engineering candidates.
            </p>
          </div>

          {/* Admin Approval Architecture Alert */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '28px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldAlert size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--accent-amber)' }}>Admin Review Policy:</strong> All student/user submissions are initially marked as <strong style={{ color: '#fff' }}>PENDING</strong> and must be approved by an administrator before appearing publicly.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research Intern"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, DeepMind, Razorpay"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="input-custom"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as typeof type)}
                  className="input-custom"
                  style={{ background: '#0d121d' }}
                >
                  <option value="internship">Internship</option>
                  <option value="job">Full-time Job</option>
                  <option value="freelance">Freelance</option>
                  <option value="hackathon">Hackathon / Competition</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Stipend / CTC *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹1,00,000 / mo or ₹24 LPA"
                  value={stipendOrSalary}
                  onChange={e => setStipendOrSalary(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru / Remote"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-custom"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                required
                placeholder="React, TypeScript, Python, PyTorch"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                className="input-custom"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Job Description &amp; Responsibilities *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe the responsibilities, perks, and eligibility requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-custom"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Official Apply Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://careers.company.com/apply"
                  value={applyUrl}
                  onChange={e => setApplyUrl(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Application Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="input-custom"
                />
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
              >
                Submit Opportunity for Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
