'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  Tag,
  Search,
  Check,
  Edit,
  Trash2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { CommunityEvent, EventCategory } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

export default function EventsPage() {
  const { currentUser, isAdmin } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [selectedEventModal, setSelectedEventModal] = useState<CommunityEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);

  const loadData = async () => {
    const evts = dbStore.getEvents(isAdmin);
    setEvents(evts);

    if (currentUser) {
      const reg = evts.filter(e => e.registeredUsers?.includes(currentUser.id)).map(e => e.id);
      setRegisteredIds(reg);
    }

    try {
      const res = await api.events.list({ limit: 100 });
      if (res.data) {
        dbStore.setEvents(res.data);
        const filtered = isAdmin ? res.data : res.data.filter(e => e.status === 'approved');
        setEvents(filtered);
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadData();
  }, [currentUser, isAdmin]);

  const handleDeleteEvent = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    soundEffects.playClick();
    await api.events.delete(id);
    dbStore.deleteEvent(id, currentUser);
    setEvents(prev => prev.filter(evt => evt.id !== id));
    if (selectedEventModal?.id === id) {
      setSelectedEventModal(null);
    }
  };

  const handleApproveEvent = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;
    soundEffects.playSuccess();
    await api.events.review(id, 'approved');
    dbStore.updateEventStatus(id, 'approved', currentUser);
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, status: 'approved' } : evt));
    if (selectedEventModal?.id === id) {
      setSelectedEventModal(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleSaveEvent = async (updated: CommunityEvent) => {
    if (!currentUser) return;
    await api.events.update(updated.id, updated);
    dbStore.updateEvent(updated, currentUser);
    setEvents(prev => prev.map(evt => evt.id === updated.id ? updated : evt));
    if (selectedEventModal?.id === updated.id) {
      setSelectedEventModal(updated);
    }
  };

  const categories = [
    'All',
    'Hackathons',
    'Workshops',
    'Coding Competitions',
    'Webinars',
    'AI Events',
    'Conferences',
  ];

  const handleRegister = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    soundEffects.playClick();
    const isNowRegistered = dbStore.toggleRegisterEvent(eventId, currentUser.id);
    if (isNowRegistered) {
      setRegisteredIds(prev => [...prev, eventId]);
      soundEffects.playSuccess();
    } else {
      setRegisteredIds(prev => prev.filter(id => id !== eventId));
    }
    setEvents([...dbStore.getEvents()]);
  };

  const filtered = events.filter(evt => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchOrganizer = evt.organizer.toLowerCase().includes(q);
      const matchSkill = evt.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrganizer && !matchSkill) return false;
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
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
            Flagship &amp; Campus Events
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Events, Hackathons &amp; Workshops
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Learn from industry architects, participate in global hackathons, and earn verified badges.
          </p>
        </div>

        <a
          href="/events/submit"
          onClick={() => soundEffects.playClick()}
          className="btn btn-primary"
          style={{ padding: '12px 22px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
        >
          <PlusCircle size={18} /> Host / Submit Event
        </a>
      </div>

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
            placeholder="Search events..."
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

      {/* Events Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
        }}
      >
        {filtered.map(evt => {
          const isRegistered = registeredIds.includes(evt.id);
          return (
            <div
              key={evt.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedEventModal(evt);
              }}
              className="glass-card glass-card-interactive"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              {/* Event Banner */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={evt.bannerImage}
                  alt={evt.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className="badge badge-amber"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {evt.category.toUpperCase()}
                </span>
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.74rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Users size={12} /> {evt.participantsCount} Registered
                </span>
              </div>

              {/* Body Content */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
                    {evt.organizer}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '12px' }}>
                    {evt.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                    {evt.description.slice(0, 110)}...
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-amber)' }} />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{evt.isOnline ? 'Online / Virtual Stream' : evt.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {evt.skills.map((s, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: '0.72rem' }}>
                        {s}
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
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Deadline: {evt.registrationDeadline}
                  </span>

                  <button
                    onClick={e => handleRegister(evt.id, e)}
                    className={isRegistered ? 'btn-success' : 'btn-primary'}
                    style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    {isRegistered ? (
                      <>
                        <Check size={14} /> Registered
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </button>
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
                          evt.status === 'approved'
                            ? 'badge badge-emerald'
                            : evt.status === 'rejected'
                            ? 'badge badge-rose'
                            : 'badge badge-amber'
                        }
                        style={{ fontSize: '0.68rem' }}
                      >
                        {evt.status?.toUpperCase() || 'APPROVED'}
                      </span>
                      {evt.status !== 'approved' && (
                        <button
                          onClick={e => handleApproveEvent(evt.id, e)}
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
                          setEditingEvent(evt);
                        }}
                        className="btn-secondary"
                        title="Modify Event"
                        style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={e => handleDeleteEvent(evt.id, e)}
                        className="btn-ghost"
                        title="Delete Event"
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

      {/* Event Details Modal */}
      {selectedEventModal && (
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
          onClick={() => setSelectedEventModal(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '680px',
              width: '100%',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-glass)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
              <img
                src={selectedEventModal.bannerImage}
                alt={selectedEventModal.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="badge badge-amber" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                {selectedEventModal.category}
              </span>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
                {selectedEventModal.organizer}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '14px' }}>
                {selectedEventModal.title}
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} style={{ color: 'var(--accent-amber)' }} />
                  <span>{selectedEventModal.date} ({selectedEventModal.time})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span>{selectedEventModal.isOnline ? 'Online Event' : selectedEventModal.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} style={{ color: 'var(--accent-emerald)' }} />
                  <span>{selectedEventModal.participantsCount} developers registered</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Description &amp; Agenda</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedEventModal.description}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Eligibility</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {selectedEventModal.eligibility}
                </p>
              </div>

              {/* Admin Modal Controls */}
              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>ADMIN POWERS</span>
                    {selectedEventModal.status !== 'approved' && (
                      <button
                        onClick={e => handleApproveEvent(selectedEventModal.id, e)}
                        className="btn-success"
                        style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                      >
                        Allow / Approve
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingEvent(selectedEventModal)}
                      className="btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit size={12} /> Modify Event
                    </button>
                    <button
                      onClick={e => handleDeleteEvent(selectedEventModal.id, e)}
                      className="btn-ghost"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="btn-ghost"
                >
                  Close
                </button>

                <button
                  onClick={e => {
                    handleRegister(selectedEventModal.id, e);
                    setSelectedEventModal(null);
                  }}
                  className={registeredIds.includes(selectedEventModal.id) ? 'btn-success' : 'btn-primary'}
                  style={{ padding: '10px 24px' }}
                >
                  {registeredIds.includes(selectedEventModal.id) ? 'Registered (Click to cancel)' : 'Register for Free (+40 XP)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingEvent && (
        <AdminEditModal
          isOpen={Boolean(editingEvent)}
          onClose={() => setEditingEvent(null)}
          type="event"
          item={editingEvent}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
