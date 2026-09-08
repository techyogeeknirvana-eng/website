'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { EventCategory } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SubmitEventPage() {
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Hackathons');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('April 15 - 17, 2026');
  const [time, setTime] = useState('10:00 AM - 6:00 PM IST');
  const [location, setLocation] = useState('Online / Discord Stage');
  const [isOnline, setIsOnline] = useState(true);
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-04-12');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all engineering students & developers');
  const [skillsInput, setSkillsInput] = useState('React, Next.js, AI, Full Stack');
  const [registrationUrl, setRegistrationUrl] = useState('https://');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in or select a profile first.');
      return;
    }

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    dbStore.addEvent(
      {
        title,
        category,
        organizer,
        date,
        time,
        location,
        isOnline,
        registrationDeadline,
        description,
        eligibility,
        skills,
        registrationUrl,
        bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      },
      currentUser
    );

    soundEffects.playSuccess();
    setSubmittedSuccess(true);
  };

  return (
    <ProtectedRoute>
      <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '800px' }}>
      <button
        onClick={() => router.back()}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Events
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
            Event Submitted Successfully!
          </h2>

          <div
            className="badge badge-amber"
            style={{ fontSize: '0.85rem', padding: '6px 14px', marginBottom: '20px' }}
          >
            <Clock size={15} /> STATUS: {isAdmin ? 'APPROVED (ADMIN AUTO-PUBLISH)' : 'PENDING ADMIN APPROVAL'}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 28px auto' }}>
            {isAdmin
              ? 'As an Admin, your event is now publicly visible in the Techyogeek Nirvana events directory.'
              : 'Your event has been submitted to the Admin Moderation Queue. Our team verifies the date, organizer, and links before broadcasting to the community.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/events')}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              Return to Events Hub
            </button>
            <button
              onClick={() => router.push('/admin/moderation')}
              className="btn btn-secondary"
              style={{ padding: '12px 24px' }}
            >
              Open Moderation Queue
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
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
              Community Host Portal
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Host or Submit a Tech Event</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.92rem' }}>
              Publish your hackathon, college workshop, or webinar to thousands of active tech learners.
            </p>
          </div>

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
              <strong style={{ color: 'var(--accent-amber)' }}>Admin Approval Pipeline:</strong> In compliance with platform standards, all user-submitted events enter <strong style={{ color: '#fff' }}>PENDING</strong> review to prevent spam and verify registration legitimacy.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nirvana Global Hackathon 2026"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-custom"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as EventCategory)}
                  className="input-custom"
                  style={{ background: '#0d121d' }}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Organizer / Host Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Developer Group / Nirvana AI"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  className="input-custom"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Event Date *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. April 15 - 17, 2026"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Timing *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6:30 PM - 8:30 PM IST"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Location / Platform
                </label>
                <input
                  type="text"
                  placeholder="e.g. Online Stream or Campus Auditorium"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-custom"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Relevant Tech Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Python, React, Machine Learning, Cloud"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                className="input-custom"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Event Description &amp; Highlights *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Detail what attendees will learn, speakers, and schedule..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-custom"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Registration Link *
                </label>
                <input
                  type="url"
                  required
                  value={registrationUrl}
                  onChange={e => setRegistrationUrl(e.target.value)}
                  className="input-custom"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Registration Deadline
                </label>
                <input
                  type="date"
                  required
                  value={registrationDeadline}
                  onChange={e => setRegistrationDeadline(e.target.value)}
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
                Submit Event for Admin Approval
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
