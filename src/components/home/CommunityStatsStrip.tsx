'use client';

import React from 'react';
import { Users, Calendar, Trophy, GraduationCap, Briefcase, Handshake } from 'lucide-react';

export const communityStats = {
  members: '500+',
  events: '40+',
  hackathons: '15+',
  colleges: '15+',
  opportunities: '60+',
  collaborations: '25+'
};

export function CommunityStatsStrip() {
  const statsList = [
    { label: 'Community Members', value: communityStats.members, icon: Users, color: '#00e5ff' },
    { label: 'Events & Summits', value: communityStats.events, icon: Calendar, color: '#6366f1' },
    { label: 'Hackathons Hosted', value: communityStats.hackathons, icon: Trophy, color: '#f59e0b' },
    { label: 'Colleges Reached', value: communityStats.colleges, icon: GraduationCap, color: '#a855f7' },
    { label: 'Opportunities Shared', value: communityStats.opportunities, icon: Briefcase, color: '#10b981' },
    { label: 'Collaborations Built', value: communityStats.collaborations, icon: Handshake, color: '#ec4899' },
  ];

  return (
    <section className="relative z-20 -mt-6 mb-16 max-w-6xl mx-auto px-4">
      <div 
        className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(180deg, rgba(13, 18, 29, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)'
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {statsList.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className={`flex flex-col items-center text-center ${i > 0 ? 'pt-4 sm:pt-0 sm:pl-4' : ''}`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 shadow-md"
                  style={{
                    backgroundColor: `${stat.color}18`,
                    border: `1px solid ${stat.color}35`,
                  }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
