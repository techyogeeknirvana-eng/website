'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldAlert, 
  UserCheck, 
  Ban, 
  CheckCircle2, 
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Zap,
  Mail,
  Crown,
  X,
  Sliders,
  Plus,
  Minus,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { User, UserRole } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';
import { AdminLiveStatusBar } from '@/components/admin/AdminLiveStatusBar';
import { AdminEditModal } from '@/components/admin/AdminEditModal';

const getUserAvatar = (u?: { name?: string; avatar?: string } | null) => {
  if (u?.avatar && !u.avatar.includes('unsplash.com')) {
    return u.avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'User')}&background=0284c7&color=fff&bold=true`;
};

export default function UserManagementPage() {
  const { currentUser, allUsers, refreshUserData, openGoogleModal, isAdmin } = useAuth();
  
  // Helper to get merged user list with currentUser placed at the top and strict deduplication by email
  const getMergedUsers = () => {
    const rawUsers = dbStore.getUsers().filter(u => {
      const email = (u.email || '').toLowerCase().trim();
      const id = u.id || '';
      const name = (u.name || '').toLowerCase();
      if (id === 'user_aarav' || email.includes('example.com') || name.includes('aarav') || u.username === 'aarav_codes') {
        return false;
      }
      return true;
    });
    const seen = new Set<string>();
    const deduped: User[] = [];

    // If currentUser exists, place first
    if (currentUser) {
      const curEmail = (currentUser.email || '').toLowerCase().trim();
      if (curEmail) seen.add(curEmail);
      deduped.push(currentUser);
    }

    for (const u of rawUsers) {
      const cleanEmail = (u.email || u.id).toLowerCase().trim();
      if (!cleanEmail || seen.has(cleanEmail)) continue;
      seen.add(cleanEmail);
      deduped.push(u);
    }

    return deduped;
  };

  const [usersList, setUsersList] = useState<User[]>(getMergedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Credit Adjustment Modal State
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<User | null>(null);
  const [creditMode, setCreditMode] = useState<'delta' | 'override'>('delta');
  const [deltaDaily, setDeltaDaily] = useState<number>(0);
  const [deltaPersistent, setDeltaPersistent] = useState<number>(0);
  const [overrideDaily, setOverrideDaily] = useState<number>(10);
  const [overridePersistent, setOverridePersistent] = useState<number>(0);
  const [creditReason, setCreditReason] = useState<string>('Admin manual adjustment');
  const [refreshTick, setRefreshTick] = useState(0);

  const handleSaveUser = async (updated: User) => {
    if (!currentUser) return;
    try {
      await api.users.adminUpdate(updated.id, updated);
    } catch (_) {}
    dbStore.adminUpdateUser(updated.id, updated, currentUser);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
    setEditingUser(null);
    soundEffects.playSuccess();
    refreshUserData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser) return;
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com') {
      alert('The platform Lead Admin (techyogeeknirvana@gmail.com) cannot be deleted.');
      return;
    }

    if (currentUser.id === userId || currentUser.email?.toLowerCase() === target.email?.toLowerCase()) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete user "${target.name}" (@${target.username})? This action cannot be undone.`)) {
      return;
    }

    soundEffects.playClick();
    try {
      const res = await api.users.delete(userId);
      if (res.error) {
        alert(`Delete failed: ${res.error}`);
        return;
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
      return;
    }

    dbStore.deleteUser(userId, currentUser);
    setUsersList(prev => prev.filter(u => u.id !== userId));
    soundEffects.playSuccess();
    refreshUserData();
  };

  const handleOpenCreditModal = (u: User) => {
    soundEffects.playClick();
    setSelectedUserForCredits(u);
    const w = dbStore.getWallet(u.id);
    setDeltaDaily(0);
    setDeltaPersistent(0);
    setOverrideDaily(w.dailyCredits);
    setOverridePersistent(w.referralCredits + w.purchasedCredits);
    setCreditReason('Admin goodwill grant');
    setCreditMode('delta');
  };

  const handleSaveCredits = async () => {
    if (!selectedUserForCredits || !currentUser) return;
    soundEffects.playClick();

    const w = dbStore.getWallet(selectedUserForCredits.id);
    let dDaily = deltaDaily;
    let dPersist = deltaPersistent;

    if (creditMode === 'override') {
      dDaily = overrideDaily - w.dailyCredits;
      const currentPermanent = w.referralCredits + w.purchasedCredits;
      dPersist = overridePersistent - currentPermanent;
    }

    // 1. Call server API
    await api.credits.adminAdjust(
      selectedUserForCredits.id,
      dDaily,
      dPersist,
      creditReason || 'Admin adjustment'
    );

    // 2. Update local dbStore
    dbStore.adjustCreditsAdmin(
      selectedUserForCredits.id,
      dDaily,
      dPersist,
      creditReason || 'Admin adjustment',
      currentUser
    );

    soundEffects.playSuccess();
    setRefreshTick(t => t + 1);
    refreshUserData();
    setSelectedUserForCredits(null);
  };

  // Keep usersList synchronized whenever currentUser or allUsers updates
  useEffect(() => {
    async function loadFresh() {
      const res = await api.users.list();
      if (res.data) {
        dbStore.setUsers(res.data);
      }
      setUsersList(getMergedUsers());
    }
    loadFresh();
  }, [currentUser, allUsers, refreshTick]);

  const handleToggleSuspend = async (userId: string) => {
    if (!currentUser) return;
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com') {
      alert('The platform Lead Admin (techyogeeknirvana@gmail.com) cannot be suspended.');
      return;
    }

    if (currentUser.id === userId || currentUser.email?.toLowerCase() === target.email?.toLowerCase()) {
      alert('You cannot suspend your own active administrator account.');
      return;
    }

    const nextSuspended = !target.isSuspended;
    soundEffects.playClick();

    // 1. Optimistic UI update: instant feedback
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: nextSuspended } : u));
    // 2. Update local dbStore mirror
    dbStore.toggleSuspendUser(userId, currentUser, nextSuspended);

    // 3. Call server API with explicit nextSuspended state
    const res = await api.users.toggleSuspend(userId, nextSuspended);
    if (res.error) {
      console.error('Suspension API error:', res.error);
      // Revert if API failed
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: target.isSuspended } : u));
      alert(`Could not update suspension: ${res.error}`);
      return;
    }

    soundEffects.playSuccess();
    setRefreshTick(t => t + 1);
    refreshUserData();
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (!currentUser) return;
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    if (target.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com' && newRole !== 'ADMIN') {
      alert('The platform Lead Admin (techyogeeknirvana@gmail.com) must remain an Administrator.');
      return;
    }

    if (currentUser.id === userId && newRole !== 'ADMIN') {
      alert('You cannot demote your own active administrator account.');
      return;
    }

    soundEffects.playClick();
    // 1. Optimistic UI update
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    // 2. Update local dbStore mirror
    dbStore.changeUserRole(userId, newRole, currentUser);

    // 3. Call server API
    const res = await api.users.changeRole(userId, newRole);
    if (res.error) {
      console.error('Role change API error:', res.error);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: target.role } : u));
      alert(`Failed to change role: ${res.error}`);
      return;
    }

    soundEffects.playSuccess();
    setRefreshTick(t => t + 1);
    refreshUserData();
  };

  const filtered = searchQuery.trim() === ''
    ? usersList
    : usersList.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      <a
        href="/admin"
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} /> Back to Admin Overview
      </a>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge badge-rose" style={{ marginBottom: '8px' }}>
            RBAC &amp; Identity Administration
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage platform accounts, promote administrators, and enforce community safety suspensions.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, handle, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              width: '240px',
            }}
          />
        </div>
      </div>

      {/* Live System Time & 12:00 AM Midnight Credit Reset Bar */}
      <AdminLiveStatusBar onRefreshTriggered={() => { setUsersList(getMergedUsers()); refreshUserData(); }} />

      {/* Active Admin Session Card */}
      <div
        className="glass-card glow-border"
        style={{
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(244, 63, 94, 0.05) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={getUserAvatar(currentUser)}
              alt={currentUser?.name || 'Admin'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getUserAvatar(currentUser);
              }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-rose)',
                boxShadow: '0 0 20px rgba(244, 63, 94, 0.35)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '3px solid #0b0c16',
              }}
              title="Active Online"
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentUser?.name || 'TechYOGeek Nirvana'}
              </h2>
              <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Crown size={12} /> Lead Admin
              </span>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Active Session (You)
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span>@{currentUser?.username || currentUser?.email?.split('@')[0] || 'techyogeeknirvana'}</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{currentUser?.email || 'techyogeeknirvana@gmail.com'}</span>
              <span>•</span>
              <span>{currentUser?.title || 'Lead Platform Architect & Admin'}</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-amber)' }}>{currentUser?.xp || 15400} XP ({currentUser?.level || 'Tech Titan'})</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser && (
            <a
              href={`/profile/${currentUser.username}`}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.84rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} /> View My Profile
            </a>
          )}
          <button
            onClick={openGoogleModal}
            className="btn btn-ghost"
            style={{ padding: '8px 14px', fontSize: '0.84rem', border: '1px solid var(--border-subtle)' }}
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ padding: '8px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px 20px' }}>USER</th>
              <th style={{ padding: '16px' }}>ROLE</th>
              <th style={{ padding: '16px' }}>LEVEL &amp; XP</th>
              <th style={{ padding: '16px' }}>CREDITS</th>
              <th style={{ padding: '16px' }}>REFERRALS</th>
              <th style={{ padding: '16px' }}>STATUS</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const isCurrent = Boolean(
                currentUser && (
                  currentUser.id === user.id || 
                  (currentUser.email && user.email && currentUser.email.toLowerCase().trim() === user.email.toLowerCase().trim())
                )
              );
              const isLeadAdmin = (user.email || '').toLowerCase().trim() === 'techyogeeknirvana@gmail.com';
              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isCurrent 
                      ? 'rgba(6, 182, 212, 0.08)' 
                      : user.isSuspended 
                        ? 'rgba(244, 63, 94, 0.05)' 
                        : 'transparent',
                    boxShadow: isCurrent ? 'inset 3px 0 0 var(--accent-cyan)' : 'none',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={getUserAvatar(user)}
                        alt={user.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getUserAvatar(user);
                        }}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isCurrent ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {user.name}
                          </span>
                          {isCurrent && (
                            <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                              🟢 Logged In As (You)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          @{user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    {isLeadAdmin ? (
                      <span className="badge badge-rose" style={{ fontWeight: 700, padding: '4px 10px' }}>
                        LEAD ADMIN
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={e => handleChangeRole(user.id, e.target.value as UserRole)}
                        style={{
                          background: user.role === 'ADMIN' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          color: user.role === 'ADMIN' ? '#fda4af' : '#fff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    )}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.level}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{user.xp} XP</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    {(() => {
                      const w = dbStore.getWallet(user.id);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={13} fill="currentColor" /> {w.totalCredits}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Daily: {w.dailyCredits} | Perm: {w.referralCredits + w.purchasedCredits}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {user.referralCount || 0} invites
                      </div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>
                        {user.referralCode || '—'}
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    {user.isSuspended ? (
                      <span className="badge badge-rose">
                        <Ban size={12} /> SUSPENDED
                      </span>
                    ) : isCurrent ? (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={12} /> ACTIVE (YOU)
                      </span>
                    ) : (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={12} /> ACTIVE
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenCreditModal(user)}
                        className="btn btn-secondary"
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(6, 182, 212, 0.12)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: 'var(--accent-cyan)'
                        }}
                        title="Adjust or override user credits"
                      >
                        <Zap size={12} fill="currentColor" /> Credits
                      </button>

                      <button
                        onClick={() => setEditingUser(user)}
                        className="btn btn-secondary"
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Modify user profile & permissions"
                      >
                        <Edit size={12} /> Edit
                      </button>

                      <a
                        href={`/profile/${user.username}`}
                        className="btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        View
                      </a>

                      {isLeadAdmin || isCurrent ? (
                        <button
                          disabled
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: 0.5, cursor: 'not-allowed' }}
                          title={isLeadAdmin ? "Lead Admin account is permanent and cannot be modified or deleted" : "You cannot delete your own active account"}
                        >
                          Protected
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleSuspend(user.id)}
                            className={user.isSuspended ? 'btn-success' : 'btn-danger'}
                            style={{ padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            {user.isSuspended ? 'Restore' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn-ghost"
                            style={{ padding: '6px 8px', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer' }}
                            title="Permanently delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Credit Adjustment Modal */}
      {selectedUserForCredits && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 7, 15, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="glass-card glow-border"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={getUserAvatar(selectedUserForCredits)}
                  alt={selectedUserForCredits.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getUserAvatar(selectedUserForCredits);
                  }}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedUserForCredits.name}</h3>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      {selectedUserForCredits.role}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
                    @{selectedUserForCredits.username} • {selectedUserForCredits.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForCredits(null)}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Balances Breakdown Banner */}
            {(() => {
              const currentW = dbStore.getWallet(selectedUserForCredits.id);
              return (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Current Dual-Ledger Balance
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '8px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Daily</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{currentW.dailyCredits}</div>
                    </div>
                    <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '8px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Referral</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{currentW.referralCredits}</div>
                    </div>
                    <div style={{ background: 'rgba(234, 179, 8, 0.08)', padding: '8px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Purchased</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{currentW.purchasedCredits}</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '8px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{currentW.totalCredits}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Mode Switcher */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => setCreditMode('delta')}
                style={{
                  flex: 1,
                  padding: '7px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: 'none',
                  background: creditMode === 'delta' ? 'var(--accent-cyan)' : 'transparent',
                  color: creditMode === 'delta' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Adjust (+ / -)
              </button>
              <button
                type="button"
                onClick={() => setCreditMode('override')}
                style={{
                  flex: 1,
                  padding: '7px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: 'none',
                  background: creditMode === 'override' ? 'var(--accent-cyan)' : 'transparent',
                  color: creditMode === 'override' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Direct Set (Override)
              </button>
            </div>

            {/* Adjustment Form Fields */}
            {creditMode === 'delta' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Daily Credits (+ / -)
                  </label>
                  <input
                    type="number"
                    value={deltaDaily}
                    onChange={e => setDeltaDaily(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="input-custom"
                    style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                    Resets every midnight UTC
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Persistent Credits (+ / -)
                  </label>
                  <input
                    type="number"
                    value={deltaPersistent}
                    onChange={e => setDeltaPersistent(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="input-custom"
                    style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                    Never expires
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Target Daily Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={overrideDaily}
                    onChange={e => setOverrideDaily(Math.max(0, parseInt(e.target.value) || 0))}
                    className="input-custom"
                    style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                    Directly overrides daily balance
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Target Persistent Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={overridePersistent}
                    onChange={e => setOverridePersistent(Math.max(0, parseInt(e.target.value) || 0))}
                    className="input-custom"
                    style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                    Directly overrides persistent pool
                  </span>
                </div>
              </div>
            )}

            {/* Audit Reason Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Audit Log Reason / Note
              </label>
              <input
                type="text"
                value={creditReason}
                onChange={e => setCreditReason(e.target.value)}
                placeholder="e.g. Hackathon winner reward, Support refund, Manual correction"
                className="input-custom"
                required
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedUserForCredits(null)}
                className="btn-ghost"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCredits}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                <Zap size={14} fill="currentColor" /> Commit Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal for Users */}
      {editingUser && (
        <AdminEditModal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          type="user"
          item={editingUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
