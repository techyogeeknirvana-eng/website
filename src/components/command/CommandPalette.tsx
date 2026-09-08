'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Briefcase, 
  Calendar, 
  Users, 
  FileText, 
  Compass, 
  Code, 
  Radio, 
  Layers, 
  X,
  ArrowRight,
  Shield
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  type: 'navigation' | 'action' | 'opportunity' | 'event' | 'quiz' | 'roadmap';
  url: string;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isAdmin } = useAuth();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        soundEffects.playClick();
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable catalogue
  const opportunities = dbStore.getOpportunities();
  const events = dbStore.getEvents();
  const quizzes = dbStore.getQuizzes();
  const roadmaps = dbStore.getLearningPaths();

  const baseItems: SearchItem[] = [
    { id: 'act_ai', title: 'Ask Nirvana AI Assistant', category: 'Quick Action', type: 'action', url: '#ai-chat', icon: <Sparkles size={16} style={{ color: 'var(--accent-indigo)' }} /> },
    { id: 'act_resume', title: 'Analyze Resume in AI Resume Lab', category: 'Quick Action', type: 'action', url: '/resume-lab', icon: <FileText size={16} style={{ color: 'var(--accent-cyan)' }} /> },
    { id: 'act_quiz_create', title: 'Create Live Quiz / Presentation', category: 'Quick Action', type: 'action', url: '/live/create', icon: <Radio size={16} style={{ color: 'var(--accent-amber)' }} /> },
    { id: 'act_collab', title: 'Find Hackathon Teammates (Collab Finder)', category: 'Quick Action', type: 'action', url: '/collab-finder', icon: <Users size={16} style={{ color: 'var(--accent-emerald)' }} /> },
    { id: 'nav_community', title: 'Community Discord-style Channels', category: 'Navigation', type: 'navigation', url: '/community', icon: <Users size={16} /> },
    { id: 'nav_opps', title: 'Browse Jobs & Internships Marketplace', category: 'Navigation', type: 'navigation', url: '/opportunities', icon: <Briefcase size={16} /> },
    { id: 'nav_events', title: 'Upcoming Events & Hackathons', category: 'Navigation', type: 'navigation', url: '/events', icon: <Calendar size={16} /> },
    { id: 'nav_live', title: 'Nirvana Live (Join with PIN)', category: 'Navigation', type: 'navigation', url: '/live/join', icon: <Radio size={16} /> },
    { id: 'nav_radar', title: 'Interactive Tech Radar 2026', category: 'Navigation', type: 'navigation', url: '/tech-radar', icon: <Compass size={16} /> },
    { id: 'nav_interview', title: 'AI Mock Interview Room', category: 'Navigation', type: 'navigation', url: '/ai-interview', icon: <Code size={16} /> },
    { id: 'nav_moments', title: 'Nirvana Moments (Community Milestones)', category: 'Navigation', type: 'navigation', url: '/moments', icon: <Sparkles size={16} /> },
    { id: 'nav_projects', title: 'Projects Showcase Hub', category: 'Navigation', type: 'navigation', url: '/projects', icon: <Layers size={16} /> },
    ...(isAdmin ? [{ id: 'nav_admin', title: 'Admin Control Center & Moderation', category: 'Admin', type: 'navigation' as const, url: '/admin', icon: <Shield size={16} style={{ color: 'var(--accent-rose)' }} /> }] : [])
  ];

  const oppItems: SearchItem[] = opportunities.slice(0, 5).map(o => ({
    id: 'opp_' + o.id,
    title: `${o.title} @ ${o.company}`,
    category: 'Opportunities',
    type: 'opportunity',
    url: `/opportunities?id=${o.id}`,
    icon: <Briefcase size={16} style={{ color: 'var(--accent-cyan)' }} />
  }));

  const eventItems: SearchItem[] = events.slice(0, 4).map(e => ({
    id: 'evt_' + e.id,
    title: e.title,
    category: 'Events',
    type: 'event',
    url: `/events?id=${e.id}`,
    icon: <Calendar size={16} style={{ color: 'var(--accent-amber)' }} />
  }));

  const quizItems: SearchItem[] = quizzes.map(q => ({
    id: 'qz_' + q.id,
    title: q.title,
    category: 'Quizzes',
    type: 'quiz',
    url: `/live/create?quizId=${q.id}`,
    icon: <Radio size={16} style={{ color: 'var(--accent-indigo)' }} />
  }));

  const roadmapItems: SearchItem[] = roadmaps.map(r => ({
    id: 'rm_' + r.id,
    title: `${r.title} Roadmap`,
    category: 'Learning Paths',
    type: 'roadmap',
    url: `/roadmaps?id=${r.id}`,
    icon: <Compass size={16} style={{ color: 'var(--accent-emerald)' }} />
  }));

  const allItems = [...baseItems, ...oppItems, ...eventItems, ...quizItems, ...roadmapItems];

  const filteredItems = query.trim() === ''
    ? baseItems
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 9);

  const handleSelect = (item: SearchItem) => {
    soundEffects.playClick();
    setIsOpen(false);
    if (item.url === '#ai-chat') {
      window.dispatchEvent(new CustomEvent('toggle-nirvana-ai'));
    } else {
      router.push(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-glass)',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} style={{ color: 'var(--accent-indigo)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search events, jobs, quizzes, roadmaps..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
              }}
            >
              ESC
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-ghost"
              style={{ padding: '4px', borderRadius: '4px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    size={15}
                    style={{
                      color: isSelected ? 'var(--accent-indigo)' : 'var(--text-muted)',
                      opacity: isSelected ? 1 : 0.4,
                    }}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <span>Use ↑ ↓ to navigate</span>
          <span>Press Enter to select</span>
          <span>Techyogeek Nirvana Command Center</span>
        </div>
      </div>
    </div>
  );
}
