'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Trophy, 
  Zap, 
  Globe, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Award, 
  CheckCircle2,
  Share2,
  Edit3,
  X,
  Check,
  Flame,
  Shield
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { currentUser, updateProfile } = useAuth();

  const user = dbStore.getUser(username) || currentUser || dbStore.getUsers()[0];
  const isOwner = currentUser?.id === user.id || currentUser?.username === user.username;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editTitle, setEditTitle] = useState(user.title || '');
  const [editCollege, setEditCollege] = useState(user.collegeOrCompany || '');
  const [editEducation, setEditEducation] = useState(user.education || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editSkills, setEditSkills] = useState(user.skills?.join(', ') || '');

  const handleShare = () => {
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Copied profile link for ${user.name}`);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);
    await updateProfile({
      name: editName,
      title: editTitle,
      collegeOrCompany: editCollege,
      education: editEducation,
      bio: editBio,
      skills: skillsArray,
    });
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-8 max-w-4xl">
        {/* Profile Card */}
        <div className="mono-card p-6 sm:p-12 space-y-8 relative">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="editorial-eyebrow">
              USER IDENTITY // {user.role === 'ADMIN' ? 'LEAD ADMIN' : 'STUDENT MEMBER'}
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsEditing(true);
                  }}
                  className="btn btn-secondary text-xs py-1.5 px-3 font-semibold inline-flex items-center gap-1.5"
                >
                  <Edit3 size={13} />
                  <span>Edit Profile</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="btn btn-outline text-xs py-1.5 px-3 font-semibold inline-flex items-center gap-1.5"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full border border-white/20 overflow-hidden shrink-0">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=000&color=fff&bold=true`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-inherit">
                  {user.name}
                </h1>
                <span className="mono-badge text-xs py-0.5 px-2.5">
                  {user.level.toUpperCase()}
                </span>
                {user.role === 'ADMIN' && (
                  <span className="mono-badge text-xs py-0.5 px-2.5 font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-[#737373]">
                {user.title} • @{user.username}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
                <GraduationCap size={14} />
                <span>{user.education} ({user.collegeOrCompany})</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed max-w-2xl">
            {user.bio || 'Active member of the TechYOGeek student technology ecosystem.'}
          </p>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 dark:border-white/10 light:border-black/10 text-center">
            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">XP Balance</div>
              <div className="font-display font-black text-xl text-inherit">{user.xp || 0}</div>
            </div>
            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">Badges</div>
              <div className="font-display font-black text-xl text-inherit">{user.badges?.length || 0}</div>
            </div>
            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">Level</div>
              <div className="font-display font-black text-xl text-inherit">{user.level}</div>
            </div>
            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">Role</div>
              <div className="font-display font-black text-xl text-inherit">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Skills & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mono-card p-6 sm:p-8 space-y-4">
            <div className="editorial-eyebrow">SKILLS &amp; TECHNOLOGIES</div>
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skill, idx) => (
                <span key={idx} className="mono-badge text-xs py-1 px-3">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mono-card p-6 sm:p-8 space-y-4">
            <div className="editorial-eyebrow">HONORS &amp; BADGES</div>
            <div className="flex flex-wrap gap-2">
              {user.badges?.map((badge, idx) => (
                <span key={idx} className="p-2 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold flex items-center gap-1.5">
                  <Trophy size={13} />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="mono-card max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-display font-bold text-lg">Edit Your Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-[#737373] hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">Title / Role</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Computer Science Undergrad"
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">College / University</label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">Education / Degree</label>
                  <input
                    type="text"
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    placeholder="B.Tech Computer Science"
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">Bio</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#737373] uppercase">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs py-2 px-5 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
