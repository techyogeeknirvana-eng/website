'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Calendar, 
  Trophy, 
  Layers, 
  MessageSquare,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface IdentityOption {
  id: string;
  label: string;
  subtitle: string;
}

interface GoalOption {
  id: string;
  label: string;
  icon: any;
  color: string;
}

interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  milestone: string;
  actionUrl: string;
  actionLabel: string;
}

export function TYGNJourney() {
  const [selectedIdentity, setSelectedIdentity] = useState<string>('student-1-2');
  const [selectedGoal, setSelectedGoal] = useState<string>('communication');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const identities: IdentityOption[] = [
    { id: 'student-1-2', label: '1st / 2nd Year Student', subtitle: 'Building fundamentals & exploring tech domains' },
    { id: 'student-3-4', label: '3rd / 4th Year Student', subtitle: 'Internship seeking, resume building & hiring prep' },
    { id: 'builder', label: 'Core Developer / Builder', subtitle: 'Building open-source, scaling code & hackathons' },
    { id: 'leader', label: 'Club Lead / Community Organizer', subtitle: 'Leading hack squads, public speaking & mentorship' }
  ];

  const goals: GoalOption[] = [
    { id: 'communication', label: 'Communication & Verbal Polish', icon: MessageSquare, color: '#00e5ff' },
    { id: 'technical', label: 'Technical Depth & Projects', icon: Layers, color: '#6366f1' },
    { id: 'career', label: 'Internships & Career Placement', icon: Trophy, color: '#10b981' },
    { id: 'leadership', label: 'Confidence & Leadership Demeanor', icon: Compass, color: '#f59e0b' }
  ];

  const generatePlan = (): WeekPlan[] => {
    if (selectedGoal === 'communication') {
      return [
        { week: 1, title: 'Week 1 &bull; Etiquette & Manners', focus: 'Adaptive Verbal Manners Quiz', milestone: 'Score >= 7/10 on the 10-Question Etiquette Engine', actionUrl: '/growth', actionLabel: 'Take Quiz' },
        { week: 2, title: 'Week 2 &bull; Tone Refactoring', focus: 'Say It Better Game', milestone: 'Improve 5 blunt workplace messages with 90%+ Tone Score', actionUrl: '/games', actionLabel: 'Play Say It Better' },
        { week: 3, title: 'Week 3 &bull; Presentation & Pitching', focus: 'The 30-Second Elevator Pitch', milestone: 'Complete the Daily Growth Challenge without filler words', actionUrl: '/growth', actionLabel: 'Practice Challenge' },
        { week: 4, title: 'Week 4 &bull; Simulation & Interview', focus: 'Conversation Simulator', milestone: 'Successfully pass the Technical Screening Behavioral Simulator', actionUrl: '/growth', actionLabel: 'Run Simulator' }
      ];
    } else if (selectedGoal === 'technical') {
      return [
        { week: 1, title: 'Week 1 &bull; Knowledge Commons', focus: 'B.Tech Notes & Tech Radar', milestone: 'Explore 3 production frameworks on Tech Radar 2026', actionUrl: '/tech-radar', actionLabel: 'View Radar' },
        { week: 2, title: 'Week 2 &bull; Live CS Quiz Arena', focus: 'Nirvana Live Room', milestone: 'Participate in 2 competitive coding quizzes', actionUrl: '/live', actionLabel: 'Enter Live Arena' },
        { week: 3, title: 'Week 3 &bull; Team Collab Match', focus: 'Collab Finder', milestone: 'Connect with a project co-builder or hackathon partner', actionUrl: '/collab-finder', actionLabel: 'Find Teammate' },
        { week: 4, title: 'Week 4 &bull; Open-Source Shipping', focus: 'Projects Showcase', milestone: 'Publish a working prototype to the TYGN showcase repository', actionUrl: '/projects', actionLabel: 'Submit Project' }
      ];
    } else if (selectedGoal === 'career') {
      return [
        { week: 1, title: 'Week 1 &bull; ATS Resume Audit', focus: 'AI Resume Lab & OCR', milestone: 'Score 85%+ on ATS scan with quantifiable impact bullets', actionUrl: '/resume-lab', actionLabel: 'Audit Resume' },
        { week: 2, title: 'Week 2 &bull; Market Opportunities', focus: 'Opportunities Hub', milestone: 'Save 3 verified internships aligned with your stack', actionUrl: '/opportunities', actionLabel: 'Browse Jobs' },
        { week: 3, title: 'Week 3 &bull; Interview Simulation', focus: 'AI Mock Interview Room', milestone: 'Complete technical voice & DSA screening simulation', actionUrl: '/ai-interview', actionLabel: 'Launch Interview' },
        { week: 4, title: 'Week 4 &bull; Cold Outreach & Referrals', focus: 'Professional Outreach Blueprint', milestone: 'Send 2 high-yield referral emails using TYGN templates', actionUrl: '/growth', actionLabel: 'View Email Guide' }
      ];
    } else {
      return [
        { week: 1, title: 'Week 1 &bull; Active Listening', focus: 'Paraphrasing & Team Verification', milestone: 'Practice verifying requirements in sprint meetings', actionUrl: '/growth', actionLabel: 'Explore Lessons' },
        { week: 2, title: 'Week 2 &bull; Psychological Safety', focus: 'Inclusive Leadership', milestone: 'Host or organize a 30-minute student study circle', actionUrl: '/community', actionLabel: 'Community Hub' },
        { week: 3, title: 'Week 3 &bull; Conflict De-escalation', focus: 'Disagree and Commit Protocol', milestone: 'Complete the Hackathon Mediation scenario', actionUrl: '/growth', actionLabel: 'Practice Conflict' },
        { week: 4, title: 'Week 4 &bull; Community Hack Sprint', focus: 'Leading a TYGN Team', milestone: 'Guide a 4-person team through a regional hackathon', actionUrl: '/events', actionLabel: 'Explore Hacks' }
      ];
    }
  };

  const plan = generatePlan();

  return (
    <section className="relative z-20 py-20 px-4 max-w-6xl mx-auto">
      <div 
        className="glass-card rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.12), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 7, 13, 0.98) 100%)'
        }}
      >
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> The Signature Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
            The TYGN Journey
          </h2>
          <p className="text-slate-300/80 text-sm sm:text-base leading-relaxed">
            Tell us where you are and what you want to elevate. TYGN instantly generates your customized 4-week growth and engineering accelerator.
          </p>
        </div>

        {/* Step 1: Who are you? */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px]">1</span>
            Who Are You?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {identities.map(id => {
              const isSelected = selectedIdentity === id.id;
              return (
                <button
                  key={id.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedIdentity(id.id);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-cyan-400/80 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{id.label}</span>
                    {isSelected && <Check size={16} className="text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{id.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: What do you want to improve? */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-400/20 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
            What Do You Want to Improve?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {goals.map(goal => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedGoal(goal.id);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-indigo-400/80 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">{goal.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Generate Journey */}
        <div className="text-center mb-12">
          <button
            onClick={() => {
              soundEffects.playSuccess();
              setIsGenerated(true);
            }}
            className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-xl shadow-indigo-500/30 transition-transform transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>Generate My 4-Week TYGN Journey</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Step 3: Generated 4-Week Roadmap */}
        {isGenerated && (
          <div className="pt-8 border-t border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Personalized Roadmap</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Your 4-Week TYGN Growth Path</h3>
              </div>
              <button
                onClick={() => setIsGenerated(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {plan.map((item, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl p-5 border border-white/10 bg-white/[0.03] shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      {item.title}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{item.focus}</h4>
                    <p className="text-xs text-slate-300/80 leading-relaxed mb-4">
                      {item.milestone}
                    </p>
                  </div>
                  <Link
                    href={item.actionUrl}
                    onClick={() => soundEffects.playClick()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-center">
              <span className="text-xs sm:text-sm text-cyan-200 font-medium">
                🎯 Ready to level up? Start with Week 1 by entering the{' '}
                <Link href="/growth" className="underline font-bold text-white hover:text-cyan-300">
                  Growth Hub
                </Link>.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
