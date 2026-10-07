'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  RefreshCw,
  Mail,
  Shield
} from 'lucide-react';
import { api } from '@/lib/client/api';
import { EventRegistration, RegistrationStatus } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

interface EventParticipantsModalProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EventParticipantsModal({
  eventId,
  eventTitle,
  isOpen,
  onClose
}: EventParticipantsModalProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await api.events.getRegistrations(eventId);
      if (res.data) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    }
  }, [isOpen, eventId]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (userId: string, newStatus: RegistrationStatus) => {
    soundEffects.playClick();
    try {
      await api.events.updateRegistrationStatus(eventId, userId, newStatus);
      setRegistrations(prev =>
        prev.map(r => (r.userId === userId ? { ...r, status: newStatus } : r))
      );
      soundEffects.playSuccess();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleExportCSV = () => {
    soundEffects.playClick();
    if (registrations.length === 0) {
      alert('No participant records to export.');
      return;
    }

    const headers = ['User ID', 'Name', 'Email', 'Status', 'Team Name', 'Registered At', 'Attended At'];
    const rows = registrations.map(r => [
      `"${r.userId}"`,
      `"${(r.userName || '').replace(/"/g, '""')}"`,
      `"${(r.userEmail || '').replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${(r.teamName || 'Individual').replace(/"/g, '""')}"`,
      `"${r.createdAt || ''}"`,
      `"${r.attendedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeTitle = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    link.setAttribute('download', `participants-${safeTitle}-${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (r.userName || '').toLowerCase().includes(q);
      const matchEmail = (r.userEmail || '').toLowerCase().includes(q);
      const matchTeam = (r.teamName || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchTeam) return false;
    }
    return true;
  });

  const attendedCount = registrations.filter(r => r.status === 'ATTENDED').length;
  const noShowCount = registrations.filter(r => r.status === 'NO_SHOW').length;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-neutral-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Event Participant Roster
                </h3>
                <span className="mono-badge text-[0.68rem] py-0.5 px-2 bg-white/10 text-white">
                  {registrations.length} Total
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-md">
                {eventTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary text-xs py-2 px-3.5 rounded-lg inline-flex items-center gap-1.5 font-mono"
              title="Download CSV export"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchRegistrations}
              className="btn-ghost text-xs p-2 rounded-lg text-neutral-400 hover:text-white"
              title="Refresh roster"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="btn-ghost text-xs p-2 rounded-lg text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-neutral-900/60 border-b border-white/10 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-neutral-400 text-[0.7rem] uppercase">Total Registered</div>
            <div className="text-base font-bold text-white mt-0.5">{registrations.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-neutral-400 text-[0.7rem] uppercase">Attended / Checked-in</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{attendedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-neutral-400 text-[0.7rem] uppercase">No-Show / Cancelled</div>
            <div className="text-base font-bold text-neutral-400 mt-0.5">{noShowCount}</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3 bg-neutral-950">
          <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-neutral-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs">
            <Search size={14} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Search by participant name, email, team..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full text-xs font-mono placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            {['ALL', 'REGISTERED', 'ATTENDED', 'NO_SHOW', 'CANCELLED'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`py-1 px-2.5 rounded-md border text-[0.7rem] transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-transparent text-neutral-400 border-white/15 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Participant List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="text-center py-16 text-neutral-400 font-mono text-xs">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-white" />
              Loading participant records...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 font-mono text-xs">
              {searchQuery || filterStatus !== 'ALL'
                ? 'No participants match the selected filter criteria.'
                : 'No attendees have registered for this event yet.'}
            </div>
          ) : (
            filteredRegistrations.map((reg) => (
              <div
                key={reg.userId}
                className="p-3.5 rounded-xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all flex items-center justify-between flex-wrap gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={reg.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reg.userName || 'U')}&background=262626&color=fff&bold=true`}
                    alt={reg.userName}
                    className="w-9 h-9 rounded-full object-cover border border-white/15"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {reg.userName || 'Anonymous Member'}
                      </span>
                      {reg.teamName && (
                        <span className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                          Team: {reg.teamName}
                        </span>
                      )}
                    </div>
                    <div className="text-[0.7rem] font-mono text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Mail size={11} />
                      <span>{reg.userEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`mono-badge text-[0.65rem] py-0.5 px-2 font-mono ${
                      reg.status === 'ATTENDED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : reg.status === 'NO_SHOW'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : reg.status === 'CANCELLED'
                        ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {reg.status}
                  </span>

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => handleUpdateStatus(reg.userId, 'ATTENDED')}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        reg.status === 'ATTENDED'
                          ? 'bg-emerald-500 text-black border-emerald-500'
                          : 'border-white/15 text-neutral-400 hover:text-white hover:border-white/30'
                      }`}
                      title="Mark Attended"
                    >
                      <UserCheck size={14} />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(reg.userId, 'NO_SHOW')}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        reg.status === 'NO_SHOW'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'border-white/15 text-neutral-400 hover:text-white hover:border-white/30'
                      }`}
                      title="Mark No-Show"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>
            Real-time status changes sync with verified student portfolios.
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary text-xs py-1.5 px-4 rounded-lg"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
