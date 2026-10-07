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
  Shield,
  Sliders,
  Gamepad2,
  CheckCircle2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

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
  const { isDark, setIsCustomizerOpen } = useThemeCustomizer();

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
    { id: 'act_growth', title: 'Launch Growth Hub & Verbal Manners Coach', category: 'Personal Growth', type: 'action', url: '/growth', icon: <Sparkles size={16} /> },
    { id: 'act_quiz_diagnostic', title: 'Take 10-Q Verbal Manners Diagnostic', category: 'Personal Growth', type: 'action', url: '/growth#quiz', icon: <CheckCircle2 size={16} /> },
    { id: 'act_game_say_better', title: 'Play "Say It Better" Communication Game', category: 'Games Arena', type: 'action', url: '/games', icon: <Gamepad2 size={16} /> },
    { id: 'act_customize', title: 'Customize Experience (Theme, Typography, Density)', category: 'Quick Action', type: 'action', url: '#customize', icon: <Sliders size={16} /> },
    { id: 'act_resume', title: 'Analyze Resume in AI Resume Lab', category: 'Quick Action', type: 'action', url: '/resume-lab', icon: <FileText size={16} /> },
    { id: 'act_collab', title: 'Find Hackathon Teammates (Collab Finder)', category: 'Quick Action', type: 'action', url: '/collab-finder', icon: <Users size={16} /> },
    { id: 'nav_growth', title: 'Growth Hub: Manners, Etiquette & Simulator', category: 'Navigation', type: 'navigation', url: '/growth', icon: <Sparkles size={16} /> },
    { id: 'nav_games', title: 'Games Arena: Say It Better & Dilemmas', category: 'Navigation', type: 'navigation', url: '/games', icon: <Gamepad2 size={16} /> },
    { id: 'nav_community', title: 'Community Channels & Real-Time Chat', category: 'Navigation', type: 'navigation', url: '/community', icon: <Users size={16} /> },
    { id: 'nav_opps', title: 'Browse Jobs & Internships Marketplace', category: 'Navigation', type: 'navigation', url: '/opportunities', icon: <Briefcase size={16} /> },
    { id: 'nav_events', title: 'Upcoming Events & Hackathons', category: 'Navigation', type: 'navigation', url: '/events', icon: <Calendar size={16} /> },
    { id: 'nav_radar', title: 'Interactive Tech Radar 2026', category: 'Navigation', type: 'navigation', url: '/tech-radar', icon: <Compass size={16} /> },
    { id: 'nav_notes', title: 'B.Tech Academic Drive Notes', category: 'Navigation', type: 'navigation', url: '/notes', icon: <FileText size={16} /> },
    ...(isAdmin ? [{ id: 'nav_admin', title: 'Admin Control Center & Moderation', category: 'Admin', type: 'navigation' as const, url: '/admin', icon: <Shield size={16} /> }] : [])
  ];

  const oppItems: SearchItem[] = opportunities.slice(0, 5).map(o => ({
    id: 'opp_' + o.id,
    title: `${o.title} @ ${o.company}`,
    category: 'Opportunities',
    type: 'opportunity',
    url: `/opportunities?id=${o.id}`,
    icon: <Briefcase size={16} />
  }));

  const eventItems: SearchItem[] = events.slice(0, 4).map(e => ({
    id: 'evt_' + e.id,
    title: e.title,
    category: 'Events',
    type: 'event',
    url: `/events?id=${e.id}`,
    icon: <Calendar size={16} />
  }));

  const allItems = [...baseItems, ...oppItems, ...eventItems];

  const filteredItems = query.trim() === ''
    ? baseItems
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 9);

  const handleSelect = (item: SearchItem) => {
    soundEffects.playClick();
    setIsOpen(false);
    if (item.url === '#customize') {
      setIsCustomizerOpen(true);
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
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-[12vh] p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
        style={{
          background: isDark ? '#080808' : '#ffffff',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? '#ffffff' : '#000000',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div 
          className="flex items-center gap-3 p-4 sm:p-5 border-b"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }}
        >
          <Search size={18} className="text-[#737373] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to feature..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-sans p-0 shadow-none focus:ring-0"
            style={{ color: 'inherit' }}
          />
          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded border border-white/10 text-[#737373]">
              ESC
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#737373] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737373]">
              No matching commands or pages found
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? isDark 
                        ? 'bg-white text-black font-bold' 
                        : 'bg-black text-white font-bold'
                      : isDark
                      ? 'text-[#d4d4d4] hover:bg-white/5 hover:text-white'
                      : 'text-[#404040] hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span 
                    className={`text-[0.65rem] uppercase font-mono px-2 py-0.5 rounded shrink-0 ${
                      isSelected
                        ? isDark ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                        : 'border border-white/10 text-[#737373]'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div 
          className="p-2.5 px-4 border-t flex items-center justify-between text-[0.68rem] text-[#737373]"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }}
        >
          <span>Navigate with ↑ ↓ keys</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
