'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Gamepad2, 
  Handshake, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface EcosystemNode {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  href: string;
  icon: any;
  color: string;
  angle: number; // in degrees for circular layout
}

export function EcosystemVisualizer() {
  const [hoveredNode, setHoveredNode] = useState<EcosystemNode | null>(null);

  const nodes: EcosystemNode[] = [
    {
      id: 'events',
      name: 'Events',
      tagline: 'Technical Summits & Sprints',
      desc: 'Workshops, university summits, and hands-on masterclasses.',
      href: '/events',
      icon: Calendar,
      color: '#00e5ff',
      angle: 0
    },
    {
      id: 'hackathons',
      name: 'Hackathons',
      tagline: 'High-Impact Hack Sprints',
      desc: 'Collaborative 24-48 hour builds with mentorship and prizes.',
      href: '/events',
      icon: Trophy,
      color: '#6366f1',
      angle: 40
    },
    {
      id: 'learning',
      name: 'Learning',
      tagline: 'B.Tech Notes & Roadmaps',
      desc: 'Direct curriculum study materials, tech radars, and skill trees.',
      href: '/notes',
      icon: BookOpen,
      color: '#38bdf8',
      angle: 80
    },
    {
      id: 'opportunities',
      name: 'Opportunities',
      tagline: 'Internships & Fellowships',
      desc: 'Verified tech roles, scholarships, open-source cohorts.',
      href: '/opportunities',
      icon: Briefcase,
      color: '#10b981',
      angle: 120
    },
    {
      id: 'community',
      name: 'Community',
      tagline: 'Real-time Developer Channels',
      desc: 'Chat, peer code reviews, collaboration finder, and moments.',
      href: '/community',
      icon: Users,
      color: '#a855f7',
      angle: 160
    },
    {
      id: 'growth',
      name: 'Growth Hub',
      tagline: 'Personal & Professional Mastery',
      desc: 'Verbal manners, interview skills, confidence and leadership.',
      href: '/growth',
      icon: TrendingUp,
      color: '#f59e0b',
      angle: 200
    },
    {
      id: 'communication',
      name: 'Communication',
      tagline: 'Adaptive Speech Coach',
      desc: '10-question adaptive etiquette quizzes and feedback.',
      href: '/growth',
      icon: MessageSquare,
      color: '#ec4899',
      angle: 240
    },
    {
      id: 'games',
      name: 'Games Arena',
      tagline: 'Say It Better & Trivia',
      desc: 'Fast decision-making, etiquette dilemmas, and vocabulary.',
      href: '/games',
      icon: Gamepad2,
      color: '#f43f5e',
      angle: 280
    },
    {
      id: 'partnerships',
      name: 'Partnerships',
      tagline: '15+ Colleges & Communities',
      desc: 'Inter-university alliances, student tech clubs, and sponsors.',
      href: '/about',
      icon: Handshake,
      color: '#818cf8',
      angle: 320
    }
  ];

  return (
    <section className="relative z-20 py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={13} /> The Integrated Network
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
          TYGN Ecosystem
        </h2>
        <p className="text-slate-300/80 text-base sm:text-lg">
          Nine interconnected domains operating as one cohesive student technology and growth accelerator.
        </p>
      </div>

      {/* Interactive Visualizer Canvas / Hub */}
      <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-4">
        {/* Orbital Track Rings */}
        <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] rounded-full border border-white/[0.08] pointer-events-none" />
        <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-white/[0.04] pointer-events-none border-dashed animate-spin" style={{ animationDuration: '60s' }} />

        {/* Center Nucleus (TYGN) */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          <div 
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-center p-4 shadow-2xl transition-all cursor-pointer relative group"
            style={{
              background: 'radial-gradient(circle, #6366f1 0%, #00e5ff 80%, #07090e 100%)',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.5), 0 0 80px rgba(0, 229, 255, 0.3)'
            }}
          >
            <div className="text-white font-black text-xl sm:text-2xl font-display tracking-wider">
              TYGN
            </div>
            <div className="text-[10px] text-cyan-200 font-bold uppercase tracking-widest mt-0.5">
              Nirvana
            </div>
          </div>
        </div>

        {/* Orbital Nodes */}
        {nodes.map((node, i) => {
          const radius = 220; // in px for desktop
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const Icon = node.icon;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <div
              key={node.id}
              className="absolute transition-transform z-30"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              onMouseEnter={() => {
                soundEffects.playHover?.();
                setHoveredNode(node);
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <Link
                href={node.href}
                onClick={() => soundEffects.playClick()}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl glass-card border transition-all shadow-lg backdrop-blur-md ${
                  isHovered 
                    ? 'scale-110 border-white/40 shadow-2xl z-40' 
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{
                  backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(13, 18, 29, 0.75)',
                  boxShadow: isHovered ? `0 0 25px ${node.color}50` : undefined,
                  borderColor: isHovered ? node.color : undefined
                }}
              >
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${node.color}25`,
                    color: node.color
                  }}
                >
                  <Icon size={15} />
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {node.name}
                </span>
              </Link>
            </div>
          );
        })}

        {/* Live Hover Information Overlay at Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <div className="glass-card rounded-2xl p-4 border border-white/15 text-center shadow-2xl backdrop-blur-xl">
            {hoveredNode ? (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: hoveredNode.color }}>
                  <span>{hoveredNode.tagline}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mb-2">
                  {hoveredNode.desc}
                </p>
                <Link
                  href={hoveredNode.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Explore {hoveredNode.name}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1">
                Hover over any node in the TYGN ecosystem to view details, or click to explore.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
