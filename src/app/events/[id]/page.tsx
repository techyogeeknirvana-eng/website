'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  Edit, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { CommunityEvent } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { currentUser, isAdmin } = useAuth();

  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // 1. Initial quick load from local dbStore
    const localEvt = dbStore.getEvent(eventId);
    if (localEvt) {
      setEvent(localEvt);
      if (currentUser) {
        setIsRegistered(Boolean(localEvt.registeredUsers?.includes(currentUser.id)));
      }
      setIsLoading(false);
    }

    // 2. Fetch fresh data from backend REST API
    api.events.list({ search: eventId, limit: 100 })
      .then(res => {
        if (res.data) {
          const match = res.data.find(e => e.id === eventId);
          if (match) {
            setEvent(match);
            if (currentUser) {
              setIsRegistered(Boolean(match.registeredUsers?.includes(currentUser.id)));
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [eventId, currentUser]);

  const handleRegister = () => {
    if (!event || !currentUser) return;
    soundEffects.playClick();

    const registeredNow = dbStore.toggleRegisterEvent(event.id, currentUser.id);
    setIsRegistered(registeredNow);

    setEvent(prev => {
      if (!prev) return null;
      const count = registeredNow 
        ? prev.participantsCount + 1 
        : Math.max(0, prev.participantsCount - 1);
      return { ...prev, participantsCount: count };
    });

    if (registeredNow) {
      soundEffects.playSuccess();
    }
  };

  const handleShare = () => {
    soundEffects.playClick();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleApprove = async () => {
    if (!event || !currentUser) return;
    soundEffects.playSuccess();
    await api.events.review(event.id, 'approved');
    dbStore.updateEventStatus(event.id, 'approved', currentUser);
    setEvent(prev => prev ? { ...prev, status: 'approved' } : null);
  };

  const handleDelete = async () => {
    if (!event || !currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    soundEffects.playClick();
    await api.events.delete(event.id);
    dbStore.deleteEvent(event.id, currentUser);
    router.replace('/events');
  };

  const handleSaveModal = async (updated: CommunityEvent) => {
    if (!currentUser) return;
    await api.events.update(updated.id, updated);
    dbStore.updateEvent(updated, currentUser);
    setEvent(updated);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container-custom pt-32 pb-24 text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#a3a3a3]">
            LOADING EVENT DETAILS...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="container-custom pt-32 pb-24 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display font-black text-2xl text-white mb-2">Event Not Found</h2>
          <p className="text-xs text-[#a3a3a3] mb-6">
            The requested tech event or workshop could not be located in the platform registry.
          </p>
          <Link
            href="/events"
            className="btn btn-primary text-xs py-2 px-5 rounded-full font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to Events Hub
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const posterImage = event.bannerImage || FALLBACK_BANNER;

  return (
    <ProtectedRoute>
      <div className="container-custom pt-24 sm:pt-28 pb-24 max-w-5xl">
        {/* Navigation Breadcrumb / Back Action */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/events"
            onClick={() => soundEffects.playClick()}
            className="btn-ghost text-xs py-1.5 px-3 rounded-full inline-flex items-center gap-2 text-inherit no-underline hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="btn btn-secondary text-xs py-1.5 px-3.5 rounded-full inline-flex items-center gap-1.5 text-inherit"
            title="Copy share link"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            <span>{isCopied ? 'Link Copied!' : 'Share Event'}</span>
          </button>
        </div>

        {/* HERO: Prominent Event Poster Showcase */}
        <div 
          className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl mb-8 group"
          style={{
            maxHeight: '460px',
            aspectRatio: '16 / 9',
          }}
        >
          <img
            src={posterImage}
            alt={event.title || 'Official Event Poster'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e: any) => {
              e.currentTarget.src = FALLBACK_BANNER;
            }}
          />

          {/* Gradient Overlay for Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
            <span className="mono-badge text-xs py-1 px-3 bg-black/85 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-wider">
              {event.category}
            </span>

            <div className="flex items-center gap-2">
              {event.status === 'pending' ? (
                <span className="mono-badge text-xs py-1 px-3 bg-amber-500/90 text-black font-extrabold uppercase tracking-wider shadow-lg">
                  ⏳ PENDING ADMIN APPROVAL
                </span>
              ) : (
                <span className="mono-badge text-xs py-1 px-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider backdrop-blur-md">
                  ✓ VERIFIED EVENT
                </span>
              )}

              <span className="mono-badge text-xs py-1 px-3 bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono">
                <Users size={12} className="inline mr-1 text-[#a3a3a3]" />
                {event.participantsCount} Registered
              </span>
            </div>
          </div>

          {/* Bottom Floating Title Strip */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-300 mb-1">
              Host: <span className="text-white font-bold">{event.organizer}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Admin Quick Action Banner */}
        {isAdmin && (
          <div className="mb-8 p-4 rounded-2xl border border-white/20 bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-white" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Administrator Controls
                </span>
                <span className="text-xs text-neutral-400 block">
                  Status: <strong className="text-white uppercase">{event.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {event.status !== 'approved' && (
                <button
                  onClick={handleApprove}
                  className="btn btn-primary text-xs py-1.5 px-3.5 rounded-full font-bold flex items-center gap-1.5"
                >
                  <Check size={13} />
                  <span>Approve &amp; Publish</span>
                </button>
              )}

              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary text-xs py-1.5 px-3.5 rounded-full font-semibold flex items-center gap-1.5 text-inherit"
              >
                <Edit size={13} />
                <span>Modify Event</span>
              </button>

              <button
                onClick={handleDelete}
                className="btn-ghost text-xs py-1.5 px-3 rounded-full font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Columns: Details + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Date &amp; Schedule</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{event.date}</div>
                  <div className="text-[0.72rem] text-[#a3a3a3]">{event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Venue / Platform</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {event.isOnline ? 'Online Virtual Stage' : event.location}
                  </div>
                  <div className="text-[0.72rem] text-[#a3a3a3]">
                    {event.isOnline ? 'Discord / Stream URL' : 'Campus Venue'}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description & Highlights */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                Event Description &amp; Highlights
              </h3>
              <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans">
                {event.description}
              </div>
            </div>

            {/* Relevant Skills */}
            {event.skills && event.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Relevant Tech Skills &amp; Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-full border border-white/15 bg-white/5 text-neutral-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Eligibility &amp; Criteria
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                {event.eligibility || 'Open to all engineering students, self-taught developers, and tech builders.'}
              </p>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-6 space-y-5 sticky top-28">
              <div>
                <span className="mono-badge text-[0.65rem] py-0.5 px-2 bg-white/10 text-white mb-2 inline-block">
                  REGISTRATION STATUS
                </span>
                <div className="text-xs text-neutral-400">Deadline:</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {event.registrationDeadline}
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Primary Action: Register Now opening external URL */}
                {(() => {
                  const regUrl = (event.registrationUrl || event.eventWebsiteUrl || '').trim();
                  const hasValidUrl = Boolean(regUrl && (regUrl.startsWith('http://') || regUrl.startsWith('https://')));

                  if (hasValidUrl) {
                    return (
                      <a
                        href={regUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          soundEffects.playSuccess();
                          if (currentUser && !isRegistered) {
                            handleRegister();
                          }
                        }}
                        className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all btn-primary no-underline text-black shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                      >
                        <span>Register Now</span>
                        <ExternalLink size={15} />
                      </a>
                    );
                  }

                  return (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-[#737373] cursor-not-allowed"
                    >
                      <span>Registration Link Unavailable</span>
                    </button>
                  );
                })()}

                {/* Visit Event Website if different from registrationUrl */}
                {event.eventWebsiteUrl && event.eventWebsiteUrl.trim() !== event.registrationUrl?.trim() && (
                  <a
                    href={event.eventWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEffects.playClick()}
                    className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-xs font-semibold text-center flex items-center justify-center gap-2 no-underline text-inherit"
                  >
                    <span>Visit Event Website</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                {/* Secondary RSVP Status Badge */}
                {currentUser && isRegistered && (
                  <div className="text-[0.72rem] font-mono text-emerald-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <CheckCircle2 size={13} />
                    <span>Added to your TYGN RSVP schedule (+40 XP)</span>
                  </div>
                )}
              </div>

              {/* Submitter & Host Credentials */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-[0.68rem] font-mono uppercase text-[#737373]">
                  Organizer Information
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={event.postedBy?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={event.postedBy?.name || 'Organizer'}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white truncate">
                      {event.postedBy?.name || event.organizer}
                    </div>
                    <div className="text-[0.7rem] text-[#a3a3a3] font-mono">
                      Role: {event.postedBy?.role || 'Community Host'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Edit Modal Integration */}
        {isEditing && (
          <AdminEditModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            type="event"
            item={event}
            onSave={handleSaveModal}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
