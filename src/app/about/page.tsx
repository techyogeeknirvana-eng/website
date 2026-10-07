'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Award,
  ExternalLink,
  Sparkles,
  Compass,
  Layers
} from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  contribution: string;
  focusAreas: string[];
  linkedinUrl: string;
}

interface AboutQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ABOUT_QUIZ_QUESTIONS: AboutQuizQuestion[] = [
  {
    question: 'What does the TYGN acronym stand for?',
    options: [
      'Tech Youth Guild Network',
      'TechYOGeek Nirvana',
      'Technology Yield Growth Nexus',
      'The Young Geek Nation'
    ],
    correctAnswer: 1,
    explanation: 'TYGN stands for TechYOGeek Nirvana — a student-led technology ecosystem founded in 2023.'
  },
  {
    question: 'What is the official 5-pillar motto of TYGN Nirvana?',
    options: [
      'Code, Build, Deploy, Scale, Repeat',
      'Learn. Build. Compete. Connect. Grow.',
      'Study, Graduate, Apply, Interview, Settle',
      'Innovate, Disrupt, Conquer, Win, Prosper'
    ],
    correctAnswer: 1,
    explanation: 'Our signature pillars are Learn, Build, Compete, Connect, and Grow.'
  },
  {
    question: 'When was TechYOGeek Nirvana originally founded?',
    options: ['2021', '2023', '2025', '2019'],
    correctAnswer: 1,
    explanation: 'TYGN was founded in 2023 by engineering students to bridge theoretical classroom theory and production engineering.'
  },
  {
    question: 'What unique platform feature does TYGN provide beyond standard code repos?',
    options: [
      'Cryptocurrency token mining',
      'Personal Growth Hub: Verbal Manners, Etiquette & Executive Presence',
      'Paid textbook sales',
      'Gaming tournament streams'
    ],
    correctAnswer: 1,
    explanation: 'TYGN incorporates an adaptive Growth Hub that trains verbal manners, communication, and executive tone.'
  },
  {
    question: 'Who founded TechYOGeek Nirvana?',
    options: [
      'Anonymous faculty committee',
      'Prabh Ansh Jot Singh alongside Ishpreet and Harsh Vardhan Singh',
      'A venture capital studio',
      'Third-party marketing agency'
    ],
    correctAnswer: 1,
    explanation: 'TYGN was founded authentically by student technologists Prabh Ansh Jot Singh, Ishpreet, and Harsh Vardhan Singh.'
  },
  {
    question: 'What academic repository does TYGN provide for engineering students?',
    options: [
      'Paid subscription books',
      'Curated B.Tech Academic Google Drive with notes across branches',
      'Pirated torrent software',
      'Generic blog summaries'
    ],
    correctAnswer: 1,
    explanation: 'TYGN maintains an official verified Google Drive archive with semester notes across computer science branches.'
  }
];

export default function AboutPage() {
  const { isDark } = useThemeCustomizer();

  // Mini-Game State
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const team: TeamMember[] = [
    {
      name: 'Prabh Ansh Jot Singh',
      role: 'Founder & Technology Enthusiast',
      image: '/team/prabh-ansh-jot-singh.png',
      bio: 'Technology enthusiast focused on cybersecurity, cloud infrastructure, AI systems, and student builder ecosystems.',
      contribution: 'Founded TYGN in 2023, conceived the student growth philosophy, and architected the community ecosystem.',
      focusAreas: ['Cybersecurity', 'Cloud Platforms', 'Product Architecture', 'Community Strategy'],
      linkedinUrl: 'https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true'
    },
    {
      name: 'Ishpreet',
      role: 'Co-Founder & Full Stack Developer',
      image: '/team/ishpreet.png',
      bio: 'Full-stack developer passionate about modern frontend systems, responsive web apps, and clean developer workflows.',
      contribution: 'Co-founded TYGN, engineered platform components, and leads full-stack engineering sprints.',
      focusAreas: ['Frontend Engineering', 'Next.js & React', 'System Design', 'UI/UX Craft'],
      linkedinUrl: 'https://www.linkedin.com/in/ishpreet-singh-cse/'
    },
    {
      name: 'Harsh Vardhan Singh',
      role: 'Co-Founder & Data Analyst',
      image: '/team/harsh-vardhan-singh.jpg',
      bio: 'Data analyst focused on telemetry insights, business intelligence, pattern recognition, and community analytics.',
      contribution: 'Co-founded TYGN, directs data modeling, telemetry analytics, and student event engagement metrics.',
      focusAreas: ['Data Analytics', 'Business Intelligence', 'Telemetry Insights', 'Growth Modeling'],
      linkedinUrl: 'https://www.linkedin.com/in/harshvardhan-singh-57812537a?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ];

  const timelineEvents = [
    {
      year: '2023',
      title: 'Inception & The Core Manifesto',
      desc: 'Founded by Prabh Ansh Jot Singh to unite student technologists dissatisfied with purely theoretical university curricula.'
    },
    {
      year: '2024',
      title: 'Campus Expansion & Curated Drive',
      desc: 'Launched the official B.Tech notes drive, crossed 1,000 active student members, and initiated inter-college hackathon teams.'
    },
    {
      year: '2025',
      title: 'Interactive Live Rooms & AI Labs',
      desc: 'Introduced Mentimeter-style live quiz rooms, ATS Resume Lab, and developer Collab Finder for real-time team matching.'
    },
    {
      year: '2026',
      title: 'TYGN 2.0: Personal Growth Ecosystem',
      desc: 'Rebuilt as a premier digital platform combining technical collaboration with adaptive verbal manners and executive training.'
    }
  ];

  const handleStartQuiz = () => {
    soundEffects.playClick();
    setQuizState('active');
    setCurrentQIdx(0);
    setQuizAnswers([]);
    setSelectedOpt(null);
  };

  const handleSelectQuizOpt = (idx: number) => {
    soundEffects.playClick();
    setSelectedOpt(idx);
  };

  const handleNextQuizQuestion = () => {
    if (selectedOpt === null) return;
    soundEffects.playClick();

    const nextAnswers = [...quizAnswers, selectedOpt];
    setQuizAnswers(nextAnswers);

    if (currentQIdx < ABOUT_QUIZ_QUESTIONS.length - 1) {
      setCurrentQIdx(currentQIdx + 1);
      setSelectedOpt(null);
    } else {
      setQuizState('completed');
      soundEffects.playSuccess();
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizAnswers.forEach((ans, idx) => {
      if (ans === ABOUT_QUIZ_QUESTIONS[idx].correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-28 sm:space-y-36">
      {/* 1. HERO (Item 28) */}
      <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="editorial-eyebrow">
          OUR MISSION &amp; ORIGIN
        </div>

        <h1 className="editorial-title text-4xl sm:text-6xl md:text-8xl text-inherit">
          We Are Building More Than A Community.
        </h1>

        <p className="text-sm sm:text-lg text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl mx-auto leading-relaxed">
          An institutional-grade technology platform where ambition meets disciplined execution. Founded by engineering students, built for builders.
        </p>
      </section>

      {/* 2. WHY TYGN EXISTS (Large editorial statement) */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="editorial-eyebrow">
          WHY TYGN EXISTS
        </div>
        <div className="space-y-6 text-base sm:text-xl text-[#737373] dark:text-[#a3a3a3] light:text-[#404040] leading-relaxed">
          <p>
            Modern tech hiring does not reward rote memorization. Employers seek engineers who ship production software, communicate diplomatically across cross-functional teams, and navigate high-pressure deadlines with poise.
          </p>
          <p className="text-inherit font-medium">
            TYGN replaces passive consumption with active production. We provide the mentorship, projects, live competitions, and communication coaching required to succeed in global technology environments.
          </p>
        </div>
      </section>

      {/* 3. WHERE IT STARTED (Timeline) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="editorial-eyebrow">FOUNDING TRAJECTORY</div>
          <h2 className="editorial-title text-3xl sm:text-4xl mt-1">Where It Started</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {timelineEvents.map((item, idx) => (
            <div 
              key={idx}
              className="mono-card p-6 space-y-4"
            >
              <div className="font-display font-black text-2xl text-inherit">
                {item.year}
              </div>
              <h3 className="font-display font-bold text-base text-inherit">
                {item.title}
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHAT WE BELIEVE (Interactive Principles) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="editorial-eyebrow">CORE TENETS</div>
          <h2 className="editorial-title text-3xl sm:text-4xl mt-1">What We Believe</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3">
            <span className="text-xs font-mono text-[#737373]">PRINCIPLE 01</span>
            <h3 className="font-display font-bold text-lg text-inherit">Execution Over Credentials</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Live GitHub commits, deployed APIs, and collaborative hackathon prototypes carry more weight than attendance sheets.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3">
            <span className="text-xs font-mono text-[#737373]">PRINCIPLE 02</span>
            <h3 className="font-display font-bold text-lg text-inherit">Communication Is An Engineering Skill</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              If an engineer cannot present trade-offs, handle criticism, or write diplomatic status updates, their technical ceiling is severely limited.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3">
            <span className="text-xs font-mono text-[#737373]">PRINCIPLE 03</span>
            <h3 className="font-display font-bold text-lg text-inherit">Zero Gatekeeping</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Resources, interview questions, notes, and opportunities should be freely accessible to every committed student regardless of branch.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ABOUT PAGE GAME: HOW WELL DO YOU KNOW TYGN? (Item 29) */}
      <section className="mono-card p-6 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              INTERACTIVE MINI-GAME // KNOWLEDGE CHECK
            </div>
            <h2 className="editorial-title text-2xl sm:text-4xl mt-1">
              How Well Do You Know TYGN?
            </h2>
          </div>
          <span className="text-xs font-mono text-[#737373]">
            6-Question Explorer Challenge
          </span>
        </div>

        {quizState === 'intro' && (
          <div className="space-y-6 text-center max-w-xl mx-auto py-4">
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Test your knowledge of TYGN&apos;s history, philosophy, founders, and platform pillars to earn your verified community Explorer Score.
            </p>
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary text-xs sm:text-sm py-3 px-8 font-bold inline-flex items-center gap-2"
            >
              <span>Start Challenge</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {quizState === 'active' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
              <span>Question 0{currentQIdx + 1} of {ABOUT_QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentQIdx + 1) / ABOUT_QUIZ_QUESTIONS.length) * 100)}% Complete</span>
            </div>

            <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
              {ABOUT_QUIZ_QUESTIONS[currentQIdx].question}
            </h3>

            <div className="space-y-2.5">
              {ABOUT_QUIZ_QUESTIONS[currentQIdx].options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOpt(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? isDark
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-black text-white font-bold border-black'
                        : 'bg-white/[0.02] border-white/10 text-inherit hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{opt}</span>
                    <span className="text-xs font-mono opacity-50">[{String.fromCharCode(65 + idx)}]</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuizQuestion}
                disabled={selectedOpt === null}
                className={`btn btn-primary text-xs py-2 px-6 font-bold ${
                  selectedOpt === null ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <span>{currentQIdx < ABOUT_QUIZ_QUESTIONS.length - 1 ? 'Next' : 'Calculate Score'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {quizState === 'completed' && (
          <div className="text-center space-y-6 max-w-xl mx-auto py-6 animate-fadeIn">
            <div className="font-display font-black text-5xl sm:text-7xl text-inherit">
              {calculateScore()} / {ABOUT_QUIZ_QUESTIONS.length}
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit">
                TYGN EXPLORER // {calculateScore() >= 5 ? 'CERTIFIED SCHOLAR' : 'ACTIVE LEARNER'}
              </h3>
              <p className="text-xs text-[#737373]">
                {calculateScore() >= 5
                  ? 'Impressive! You understand the foundational philosophy and architecture of TYGN Nirvana.'
                  : 'Good effort! Explore our pillars and resources to learn more about the ecosystem.'}
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="btn btn-outline text-xs py-2 px-5 font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw size={13} />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </section>

      {/* 6. AUTHENTIC LEADERSHIP TEAM (Item 31) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="editorial-eyebrow">AUTHENTIC LEADERSHIP</div>
          <h2 className="editorial-title text-3xl sm:text-4xl mt-1">Founders &amp; Builders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full border border-white/20 overflow-hidden bg-black/40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=000&color=fff&bold=true`;
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
                    {member.name}
                  </h3>
                  <div className="text-xs text-[#737373] mt-0.5">
                    {member.role}
                  </div>
                </div>

                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-2 space-y-1">
                  <span className="text-[0.65rem] font-mono uppercase text-[#737373]">Focus Areas</span>
                  <div className="flex flex-wrap gap-1">
                    {member.focusAreas.map((tag, i) => (
                      <span key={i} className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a3a3a3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit"
                >
                  <LinkedinIcon size={13} color="currentColor" />
                  <span>Connect</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PARTNERS & INSTITUTIONS (Item 30) */}
      <section className="space-y-8 text-center max-w-3xl mx-auto">
        <div className="editorial-eyebrow">INSTITUTIONAL COLLABORATORS</div>
        <h2 className="editorial-title text-2xl sm:text-3xl">Collaborating Hubs &amp; Campuses</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {['GLBITM Campus', 'Delhi NCR Colleges', 'Student Tech Clubs', 'Open Source Orgs'].map((partner, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-xs font-mono font-bold text-[#a3a3a3] flex items-center justify-center"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
