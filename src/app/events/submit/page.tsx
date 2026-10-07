'use client';

import React, { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { EventCategory, CommunityEvent } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EventPosterUpload } from '@/components/events/EventPosterUpload';
import { api } from '@/lib/client/api';

export default function SubmitEventPage() {
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();

  // Registration & Event Link State
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [eventWebsiteUrl, setEventWebsiteUrl] = useState('');
  const [urlValidationError, setUrlValidationError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Auto-Fill Extraction State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'analyzing' | 'success' | 'partial' | 'error'>('idle');
  const [extractionMessage, setExtractionMessage] = useState('');
  const [extractedPosterCandidate, setExtractedPosterCandidate] = useState<string | null>(null);

  // Core Event Form Fields
  const [title, setTitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [posterFileName, setPosterFileName] = useState('');
  const [posterFileSize, setPosterFileSize] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<EventCategory>('Hackathons');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Online / Virtual Stream');
  const [isOnline, setIsOnline] = useState(true);
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all engineering students & developers');
  const [skillsInput, setSkillsInput] = useState('');
  
  // UI States
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterError, setPosterError] = useState('');

  // Validate URL syntax
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setRegistrationUrl(value);
    setDuplicateWarning(null);

    if (!value.trim()) {
      setUrlValidationError('');
      setExtractionStatus('idle');
      return;
    }

    if (!validateUrl(value)) {
      setUrlValidationError('Please enter a valid web address starting with http:// or https://');
      setExtractionStatus('idle');
    } else {
      setUrlValidationError('');
      if (extractionStatus !== 'success' && extractionStatus !== 'analyzing') {
        setExtractionStatus('idle');
      }
    }
  };

  // Auto-Extract Handler
  const handleAutoFill = async () => {
    const cleanUrl = registrationUrl.trim();
    if (!validateUrl(cleanUrl)) {
      soundEffects.playError();
      setUrlValidationError('Please enter a valid HTTP or HTTPS event URL first.');
      return;
    }

    setIsAnalyzing(true);
    setExtractionStatus('analyzing');
    setExtractionMessage('Analyzing event page...');
    setDuplicateWarning(null);
    soundEffects.playClick();

    try {
      const res = await api.events.extract(cleanUrl);

      if (res.error) {
        setExtractionStatus('partial');
        setExtractionMessage('Unable to automatically extract some details from this website. Please enter the remaining information manually.');
        return;
      }

      if (res.data?.duplicateWarning) {
        setDuplicateWarning(res.data.duplicateWarning.message);
      }

      const extracted = res.data?.data;

      if (extracted) {
        // SMART POPULATION: DO NOT blindly overwrite information already filled by the user!
        if (!title.trim() && extracted.title) setTitle(extracted.title);
        if (!organizer.trim() && extracted.organizer) setOrganizer(extracted.organizer);
        if (!description.trim() && extracted.description) setDescription(extracted.description);
        if (extracted.category) setCategory(extracted.category as EventCategory);
        if (!date.trim() && extracted.date) setDate(extracted.date);
        if (!time.trim() && extracted.time) setTime(extracted.time);
        if (extracted.location && location === 'Online / Virtual Stream') setLocation(extracted.location);
        if (extracted.isOnline !== undefined) setIsOnline(Boolean(extracted.isOnline));
        if (!registrationDeadline.trim() && extracted.registrationDeadline) setRegistrationDeadline(extracted.registrationDeadline);
        if (!skillsInput.trim() && extracted.skills && extracted.skills.length > 0) {
          setSkillsInput(extracted.skills.join(', '));
        }
        if (!eventWebsiteUrl.trim() && extracted.eventWebsiteUrl) {
          setEventWebsiteUrl(extracted.eventWebsiteUrl);
        }

        // Poster extraction handling:
        // If user already uploaded a poster, DO NOT overwrite it.
        // If no poster is uploaded yet and an extracted image is found:
        if (extracted.posterUrl && !bannerImage.trim()) {
          setExtractedPosterCandidate(extracted.posterUrl);
        }
      }

      if (res.data?.success) {
        soundEffects.playSuccess();
        setExtractionStatus('success');
        setExtractionMessage('Event details found. Please review before submitting.');
      } else {
        soundEffects.playClick();
        setExtractionStatus('partial');
        setExtractionMessage(res.data?.warning || 'Unable to automatically extract some details from this website. Please enter the remaining information manually.');
      }
    } catch {
      setExtractionStatus('partial');
      setExtractionMessage('Unable to automatically extract some details from this website. Please enter the remaining information manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyExtractedPoster = () => {
    if (extractedPosterCandidate) {
      soundEffects.playSuccess();
      setBannerImage(extractedPosterCandidate);
      setPosterFileName('extracted-event-poster.jpg');
      setPosterError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in or select a profile first.');
      return;
    }

    if (!registrationUrl.trim() || !validateUrl(registrationUrl)) {
      soundEffects.playError();
      setUrlValidationError('A valid HTTP/HTTPS registration or event link is required.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    if (!bannerImage.trim()) {
      soundEffects.playError();
      setPosterError('Please upload an official event poster or promotional banner.');
      window.scrollTo({ top: 320, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const addedEvent = dbStore.addEvent(
      {
        title: title.trim(),
        category,
        organizer: organizer.trim() || currentUser.name,
        date: date.trim() || 'TBA',
        time: time.trim() || 'TBA',
        location: location.trim() || (isOnline ? 'Online / Virtual Stream' : 'Campus Venue'),
        isOnline,
        registrationDeadline: registrationDeadline.trim() || date.trim() || 'TBA',
        description: description.trim(),
        eligibility: eligibility.trim() || 'Open to all engineering students',
        skills: skills.length > 0 ? skills : ['Technology', 'Engineering'],
        registrationUrl: registrationUrl.trim(),
        eventWebsiteUrl: eventWebsiteUrl.trim() || registrationUrl.trim(),
        posterUrl: bannerImage.trim(),
        bannerImage: bannerImage.trim(),
      },
      currentUser
    );

    try {
      await api.events.create({
        ...addedEvent,
        postedByUserId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        postedBy: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
        },
      });
    } catch (err) {
      console.warn('Backend event creation warning:', err);
    } finally {
      setIsSubmitting(false);
    }

    soundEffects.playSuccess();
    setSubmittedSuccess(true);
  };

  const isUrlEnteredAndValid = registrationUrl.trim().length > 0 && validateUrl(registrationUrl);

  return (
    <ProtectedRoute>
      <div className="container-custom" style={{ padding: '20px 20px 80px 20px', maxWidth: '840px' }}>
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
                ? 'As an Admin, your event is now publicly visible in the TechYOGeek Nirvana events directory.'
                : 'Your event has been submitted to the Admin Moderation Queue. Our team verifies the date, organizer, and links before broadcasting to the community.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/events')}
                className="btn btn-primary"
                style={{ padding: '12px 24px' }}
              >
                Go to Events Directory
              </button>
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setTitle('');
                  setBannerImage('');
                  setPosterFileName('');
                  setRegistrationUrl('');
                  setEventWebsiteUrl('');
                  setExtractionStatus('idle');
                }}
                className="btn btn-secondary"
                style={{ padding: '12px 24px' }}
              >
                Submit Another Event
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
                Publish your hackathon, college workshop, or webinar. Choose to paste your registration link for intelligent auto-fill or enter manually.
              </p>
            </div>

            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                marginBottom: '28px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <ShieldAlert size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--accent-amber)' }}>Admin Approval Pipeline:</strong> In compliance with platform standards, all user-submitted events enter <strong style={{ color: '#fff' }}>PENDING</strong> review to verify registration legitimacy.
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ================================================== */}
              {/* SECTION: REGISTRATION LINK & AUTO-FILL ASSISTANT */}
              {/* ================================================== */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                    <LinkIcon size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Registration / Event Link *</span>
                  </label>
                  {isUrlEnteredAndValid && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Event link detected
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', smDirection: 'row' } as any}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="url"
                      required
                      placeholder="https://unstop.com/hackathons/... or https://forms.google.com/..."
                      value={registrationUrl}
                      onChange={e => handleUrlChange(e.target.value)}
                      className="input-custom"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                    <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>

                  <button
                    type="button"
                    disabled={!isUrlEnteredAndValid || isAnalyzing}
                    onClick={handleAutoFill}
                    className="btn btn-primary"
                    style={{
                      padding: '10px 18px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      opacity: !isUrlEnteredAndValid || isAnalyzing ? 0.6 : 1,
                      cursor: !isUrlEnteredAndValid || isAnalyzing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Analyzing event page...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>✨ Auto-Fill Event Details</span>
                      </>
                    )}
                  </button>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Paste the official event or registration link. We'll try to extract the event details automatically.
                </p>

                {/* Validation Error */}
                {urlValidationError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    <AlertCircle size={14} />
                    <span>{urlValidationError}</span>
                  </div>
                )}

                {/* Duplicate Warning (Soft Warning) */}
                {duplicateWarning && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      color: '#facc15',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{duplicateWarning}</span>
                  </div>
                )}

                {/* Extraction Status Feedbacks */}
                {extractionStatus === 'success' && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                    <span>{extractionMessage}</span>
                  </div>
                )}

                {extractionStatus === 'partial' && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#fbbf24',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{extractionMessage}</span>
                  </div>
                )}

                {/* Extracted Poster Banner Prompt if found */}
                {extractedPosterCandidate && !bannerImage && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={extractedPosterCandidate}
                        alt="Extracted poster preview"
                        style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ImageIcon size={14} style={{ color: 'var(--accent-cyan)' }} />
                          <span>Poster found from event link</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Click to apply as your event banner, or upload a custom one below.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyExtractedPoster}
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={13} /> Use Extracted Poster
                    </button>
                  </div>
                )}
              </div>

              {/* Event Title */}
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

              {/* Event Poster / Banner Upload Field */}
              <div>
                <EventPosterUpload
                  value={bannerImage}
                  onChange={(url, fileInfo) => {
                    setBannerImage(url);
                    setPosterError('');
                    if (fileInfo) {
                      setPosterFileName(fileInfo.filename);
                      setPosterFileSize(fileInfo.size);
                    }
                  }}
                  required
                  initialFileName={posterFileName}
                  initialFileSize={posterFileSize}
                />
                {posterError && (
                  <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontFamily: 'monospace' }}>
                    ⚠ {posterError}
                  </p>
                )}
              </div>

              {/* Category & Organizer */}
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

              {/* Event Date, Timing, Location */}
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

              {/* Online Checkbox & Event Website URL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={e => setIsOnline(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Online / Virtual Event</span>
                </label>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Event Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://eventwebsite.com (if different)"
                    value={eventWebsiteUrl}
                    onChange={e => setEventWebsiteUrl(e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              {/* Skills */}
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

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Event Description &amp; Highlights *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail what attendees will learn, speakers, agenda, and prizes..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input-custom"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Registration Deadline & Eligibility */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Registration Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-04-12 or 2 days prior"
                    value={registrationDeadline}
                    onChange={e => setRegistrationDeadline(e.target.value)}
                    className="input-custom"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Eligibility
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Open to all engineering students"
                    value={eligibility}
                    onChange={e => setEligibility(e.target.value)}
                    className="input-custom"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    fontSize: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    fontWeight: 700,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting Event...' : 'Submit Event for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
