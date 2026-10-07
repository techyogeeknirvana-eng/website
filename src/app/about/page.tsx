'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Award, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  Sparkles, 
  Users, 
  FolderGit2, 
  Radio, 
  Bot,
  ExternalLink
} from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  focusAreas: string[];
  linkedinUrl: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ABOUT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What does the TYGN acronym represent?',
    options: [
      'Tech Youth Guild Network',
      'TechYOGeek Nirvana',
      'Technology Yield Growth Nexus',
      'The Young Geek Nation'
    ],
    correctAnswer: 1,
    explanation: 'TYGN stands for TechYOGeek Nirvana — an authentic student-led technology ecosystem founded in 2023.'
  },
  {
    question: 'What is the signature 5-pillar motto of TYGN Nirvana?',
    options: [
      'Code, Build, Deploy, Scale, Repeat',
      'Learn. Build. Compete. Connect. Grow.',
      'Study, Graduate, Apply, Interview, Settle',
      'Innovate, Disrupt, Conquer, Win, Prosper'
    ],
    correctAnswer: 1,
    explanation: 'Our foundational pillars are Learn, Build, Compete, Connect, and Grow.'
  },
  {
    question: 'When was TechYOGeek Nirvana originally founded?',
    options: ['2021', '2023', '2025', '2019'],
    correctAnswer: 1,
    explanation: 'TYGN was founded in 2023 by engineering students dissatisfied with purely theoretical curricula.'
  },
  {
    question: 'What unique capability does TYGN provide beyond code repositories?',
    options: [
      'Cryptocurrency token mining',
      'Personal Growth Hub: Verbal Manners, Etiquette & Executive Presence',
      'Paid textbook sales',
      'Gaming tournament streams'
    ],
    correctAnswer: 1,
    explanation: 'TYGN trains verbal manners, communication, and executive tone through adaptive situational quizzes.'
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
    question: 'What academic repository does TYGN curate for engineering students?',
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

  // Mini-game State (The ONLY game on About)
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const team: TeamMember[] = [
    {
      name: 'Prabh Ansh Jot Singh',
      role: 'Founder & Technology Enthusiast',
      image: '/team/prabh-ansh-jot-singh.png',
      bio: 'Technology enthusiast focused on cybersecurity, cloud infrastructure, AI systems, and student builder ecosystems. Founded TYGN in 2023 to bridge classroom theory and production engineering.',
      focusAreas: ['Cybersecurity', 'Cloud Platforms', 'Product Architecture', 'Community Strategy'],
      linkedinUrl: 'https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true'
    },
    {
      name: 'Ishpreet',
      role: 'Co-Founder & Full Stack Developer',
      image: '/team/ishpreet.png',
      bio: 'Full-stack developer passionate about modern frontend systems, responsive web apps, and clean developer workflows. Co-founded TYGN and leads full-stack engineering sprints.',
      focusAreas: ['Frontend Engineering', 'Next.js & React', 'System Design', 'UI/UX Craft'],
      linkedinUrl: 'https://www.linkedin.com/in/ishpreet-singh-cse/'
    },
    {
      name: 'Harsh Vardhan Singh',
      role: 'Co-Founder & Data Analyst',
      image: '/team/harsh-vardhan-singh.jpg',
      bio: 'Data analyst focused on telemetry insights, business intelligence, pattern recognition, and community analytics. Directs student engagement metrics and telemetry modeling.',
      focusAreas: ['Data Analytics', 'Business Intelligence', 'Telemetry Insights', 'Growth Modeling'],
      linkedinUrl: 'https://www.linkedin.com/in/harshvardhan-singh-57812537a?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ];

  const storyTimeline = [
    {
      step: '01',
      phase: 'IDEA',
      year: '2023',
      title: 'Dissatisfaction With Theory',
      description: 'Frustrated by university courses focusing purely on rote exam memorization rather than real production software, Prabh Ansh Jot Singh drafted the TYGN manifesto: a space where engineering students ship code and build real competencies.'
    },
    {
      step: '02',
      phase: 'COMMUNITY',
      year: '2023–2024',
      title: 'Peer Network & Academic Drive',
      description: 'Joined by Ishpreet and Harsh Vardhan Singh, the community expanded across Delhi NCR campuses. The team launched the official verified B.Tech notes drive, crossing 1,000 active student contributors and study cohorts.'
    },
    {
      step: '03',
      phase: 'EVENTS',
      year: '2024–2025',
      title: 'Inter-College Hackathons & Sprints',
      description: 'Organized competitive hack sprints, algorithm battles, and campus workshops. Teams from TYGN represented colleges at national hackathons, winning podium finishes and securing tech internships.'
    },
    {
      step: '04',
      phase: 'COLLABORATIONS',
      year: '2025',
      title: 'Builder Matchmaking & Mentorship',
      description: 'Introduced Collab Finder for real-time team assembly, synchronous live quiz rooms, and community moments, uniting developers, designers, and pitch presenters under one banner.'
    },
    {
      step: '05',
      phase: 'NIRVANA PLATFORM',
      year: '2026',
      title: 'The Complete Digital Ecosystem',
      description: 'TYGN 2.0 launches: an institutional-grade platform combining technical repositories and live arenas with an adaptive Personal Growth Hub that trains verbal manners, executive presence, and professional diplomacy.'
    }
  ];

  const ecosystemOfferings = [
    {
      title: 'B.Tech Notes Drive',
      description: 'Curated semester archives, subject patterns, and verified student study materials across computer science branches.',
      icon: BookOpen,
      href: '/notes',
      badge: 'ACADEMIC'
    },
    {
      title: 'Live Competitions',
      description: 'Inter-college hackathons, coding cups, workshops, and synchronous live quiz room battles.',
      icon: Trophy,
      href: '/events',
      badge: 'EVENTS'
    },
    {
      title: 'Curated Opportunities',
      description: 'High-impact tech internships, junior engineering roles, and open source builder cohorts.',
      icon: Briefcase,
      href: '/opportunities',
      badge: 'CAREERS'
    },
    {
      title: 'Personal Growth Hub',
      description: 'Adaptive 10-Question situational diagnostics, elevator pitch practice timers, and verbal tone rewriters.',
      icon: Sparkles,
      href: '/growth',
      badge: 'GROWTH'
    },
    {
      title: 'AI Developer Suite',
      description: 'ATS Resume analyzer with OCR scoring, AI mock interview room simulations, and automated code explainers.',
      icon: Bot,
      href: '/resume-lab',
      badge: 'AI TOOLS'
    },
    {
      title: 'Builder Community',
      description: 'Collab Finder for hackathon squads, real-time developer channels, and student milestone moments.',
      icon: Users,
      href: '/community',
      badge: 'NETWORK'
    },
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
      {/* SECTION 1 — HERO & IMMEDIATE INTRODUCTION */}
      <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
        <div className="editorial-eyebrow">
          THE B.TECH STUDENT COMMUNITY
        </div>

        <h1 className="editorial-title text-4xl sm:text-6xl md:text-8xl text-inherit">
          TYGN NIRVANA
        </h1>

        <div className="text-base sm:text-2xl font-mono font-bold tracking-tight text-[#a3a3a3]">
          Learn. Build. Compete. Connect. Grow.
        </div>

        <p className="text-sm sm:text-lg text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl mx-auto leading-relaxed">
          TechYOGeek Nirvana is an institutional-grade technology platform engineered by B.Tech students for ambitious builders. We bridge the critical gap between theoretical classroom curricula and high-standard production software engineering.
        </p>

        {/* What It Is / Why It Exists / Who It Is For Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <span className="text-xs font-mono text-[#737373]">WHAT TYGN IS</span>
            <h4 className="font-display font-bold text-base text-inherit">A Complete Student Ecosystem</h4>
            <p className="text-xs text-[#737373] leading-relaxed">
              Not a passive club, but a working software ecosystem with study notes, live arenas, AI tools, and growth coaching.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <span className="text-xs font-mono text-[#737373]">PROBLEM IT SOLVES</span>
            <h4 className="font-display font-bold text-base text-inherit">The Theory Trap</h4>
            <p className="text-xs text-[#737373] leading-relaxed">
              Standard curricula neglect hands-on commits, team hackathons, and diplomatic verbal presence required by top tech firms.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
            <span className="text-xs font-mono text-[#737373]">WHO IT IS FOR</span>
            <h4 className="font-display font-bold text-base text-inherit">Ambitious Engineering Students</h4>
            <p className="text-xs text-[#737373] leading-relaxed">
              Students who refuse to wait until graduation to ship software, assemble teams, and build verifiable engineering competence.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — AUTHENTIC LEADERSHIP TEAM (NEAR TOP AS REQUESTED) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="editorial-eyebrow">AUTHENTIC LEADERSHIP</div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-1">Founders &amp; Builders</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] max-w-md">
            Real student developers and technology enthusiasts who conceived, architected, and continuously evolve TYGN Nirvana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl border border-white/20 overflow-hidden bg-black/40 group-hover:scale-105 transition-transform">
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
                  className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit hover:bg-white hover:text-black transition-all"
                >
                  <LinkedinIcon size={13} color="currentColor" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — OUR STORY (CINEMATIC TIMELINE) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="editorial-eyebrow">THE TYGN JOURNEY</div>
          <h2 className="editorial-title text-3xl sm:text-5xl mt-1">Our Story</h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-2 max-w-xl">
            From late-night hostel architecture debates to an active platform powering student engineering careers across colleges.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-10 space-y-12 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-white/15">
          {storyTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center text-[10px] font-mono text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              <div className="mono-card p-6 sm:p-8 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                      {item.phase}
                    </span>
                    <span className="font-mono text-xs text-[#737373]">
                      {item.year}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#737373]">
                    MILESTONE {item.step}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — WHAT TYGN OFFERS (THE ECOSYSTEM) */}
      <section className="space-y-12">
        <div className="pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="editorial-eyebrow">THE ECOSYSTEM</div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-1">What TYGN Offers</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] max-w-md">
            Integrated digital tooling engineered to support every phase of your B.Tech engineering journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemOfferings.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="mono-card p-6 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-inherit group-hover:scale-110 transition-transform">
                      <IconComp size={18} />
                    </div>
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-inherit group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#737373] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <Link
                    href={item.href}
                    onClick={() => soundEffects.playClick()}
                    className="text-xs font-semibold text-inherit inline-flex items-center gap-1 hover:opacity-70 transition-opacity no-underline"
                  >
                    <span>Launch</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — ONE GAME ONLY: HOW WELL DO YOU KNOW TYGN? */}
      <section className="mono-card p-6 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              INTERACTIVE MINI-CHALLENGE // ONE GAME ONLY
            </div>
            <h2 className="editorial-title text-2xl sm:text-4xl mt-1">
              How Well Do You Know TYGN?
            </h2>
          </div>
          <span className="text-xs font-mono text-[#737373]">
            6-Question Knowledge Check
          </span>
        </div>

        {quizState === 'intro' && (
          <div className="space-y-6 text-center max-w-xl mx-auto py-4">
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Test your understanding of TYGN&apos;s origin, philosophy, founders, and five core pillars to calculate your verified Explorer Score.
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
                  : 'Good effort! Explore our offerings to learn more about the student builder ecosystem.'}
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
    </div>
  );
}
