'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Trophy, 
  Users, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  HelpCircle,
  Zap, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  Award,
  RotateCcw,
  Compass,
  Handshake,
  Mail
} from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  detailedBio: string;
  focusAreas: string[];
  linkedinUrl: string;
  contribution: string;
}

interface AboutQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ABOUT_QUIZ_QUESTIONS: AboutQuizQuestion[] = [
  {
    question: 'When was TechYOGeek Nirvana (TYGN) founded?',
    options: ['2021', '2023', '2025', '2019'],
    correctAnswer: 1,
    explanation: 'TYGN began in 2023 as a student-driven initiative to democratize technical learning and bridge the gap between college curricula and modern software engineering.'
  },
  {
    question: 'What is the core 5-word motto of TYGN Nirvana?',
    options: [
      'Eat, Sleep, Code, Repeat, Sleep',
      'Learn. Build. Compete. Connect. Grow.',
      'Software, Startups, Scalability, Silicon, Sales',
      'Watch Videos, Take Notes, Pass Exams, Graduate, Work'
    ],
    correctAnswer: 1,
    explanation: 'TYGN\'s five pillars are Learn, Build, Compete, Connect, and Grow—emphasizing holistic technical and personal development.'
  },
  {
    question: 'Who founded TechYOGeek Nirvana (TYGN)?',
    options: [
      'Prabh Ansh Jot Singh',
      'Sundar Pichai',
      'Aarav Sharma',
      'Sam Altman'
    ],
    correctAnswer: 0,
    explanation: 'Prabh Ansh Jot Singh is a passionate technology enthusiast and the founder of TYGN, focusing on cybersecurity, cloud, AI, and practical platforms for student builders.'
  },
  {
    question: 'What is the primary purpose of the TYGN Growth Hub?',
    options: [
      'Selling expensive video courses',
      'Training students in verbal manners, etiquette, communication polish, and interview presence',
      'Mining cryptocurrency on university computers',
      'Playing random video games during lectures'
    ],
    correctAnswer: 1,
    explanation: 'The Growth Hub is an adaptive learning layer equipping engineers with executive communication, active listening, and situational manners.'
  },
  {
    question: 'How many college chapters and technical communities are connected through TYGN?',
    options: ['0', '1', '15+ Universities and Tech Communities', 'Only 1 local school'],
    correctAnswer: 2,
    explanation: 'TYGN spans 15+ university campuses, collaborating on hackathons, seminars, and resource sharing.'
  },
  {
    question: 'What makes TYGN\'s live interactive quiz rooms unique?',
    options: [
      'They only work with printed papers',
      'Real-time PIN code joining with instant speed leaderboards (Mentimeter style)',
      'They require installing 10GB software',
      'They cost money to enter'
    ],
    correctAnswer: 1,
    explanation: 'TYGN Live features real-time WebSocket/REST presentation rooms where hundreds of students compete on PIN-secured live quizzes simultaneously.'
  }
];

export default function AboutPage() {
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // Mini-Game State
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'finished'>('intro');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const timelineSteps = [
    {
      year: '2023',
      badge: 'THE FOUNDATION',
      title: 'The Spark & Student Initiative',
      desc: 'Started as a student-led initiative to break down silos between college departments and provide passionate coders direct access to study materials, peer mentorship, and collaborative sprints.',
      color: '#f59e0b'
    },
    {
      year: 'LEARN',
      badge: 'KNOWLEDGE COMMONS',
      title: 'Curated Notes & Tech Radars',
      desc: 'Organized comprehensive semester notes, curated drive repositories, and published the Tech Radar so engineering students could focus on industry-relevant frameworks.',
      color: '#00e5ff'
    },
    {
      year: 'BUILD',
      badge: 'PROJECT INCUBATORS',
      title: 'Student Open-Source Portfolios',
      desc: 'Launched peer code showcases, collaborative repos, and hackathon incubation circles empowering student builders to deploy working web apps, AI tools, and system prototypes.',
      color: '#6366f1'
    },
    {
      year: 'COMPETE',
      badge: 'CHALLENGE ARENA',
      title: 'Hackathons & Live PIN Rooms',
      desc: 'Organized competitive hackathon squads, algorithmic speed rounds, and live interactive quiz rooms that test technical prowess in real time.',
      color: '#ec4899'
    },
    {
      year: 'CONNECT',
      badge: 'OPPORTUNITY NETWORK',
      title: 'Verified Opportunities & Referrals',
      desc: 'Forging bridges to verified internships, startup fellowships, and cross-university project teams where builders meet builders across 15+ campuses.',
      color: '#10b981'
    },
    {
      year: 'TODAY',
      badge: 'HOLISTIC ECOSYSTEM',
      title: 'Personal Growth & Communication Layer',
      desc: 'Expanding into the TYGN Growth Hub: empowering students with verbal manners, executive presence, conversation simulations, and games that forge well-rounded engineering leaders.',
      color: '#38bdf8'
    }
  ];

  const founder: TeamMember = {
    name: 'Prabh Ansh Jot Singh',
    role: 'Founder & Technology Enthusiast',
    image: '/team/prabh-ansh-jot-singh.png',
    bio: 'Technology enthusiast and founder of TYGN (TechYOGeek Nirvana), building platforms where students learn, build, compete, and discover high-impact tech opportunities.',
    detailedBio: 'Focused on cybersecurity, cloud infrastructure, AI systems, networking, and modern software development. Dedicated to helping students move past passive theory and start building live software.',
    focusAreas: ['Cybersecurity', 'Cloud Infrastructure', 'Artificial Intelligence', 'Networking', 'Software Engineering'],
    linkedinUrl: 'https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true',
    contribution: 'Architected the TYGN ecosystem vision, led cross-campus growth across 15+ colleges, and spearheaded the personal growth and technical challenge platforms.'
  };

  const coreTeam: TeamMember[] = [
    {
      name: 'Ishpreet',
      role: 'Co-Founder & Full Stack Developer',
      image: '/team/ishpreet.png',
      bio: 'Passionate Full Stack Developer focused on building scalable, user-friendly, and high-impact web architectures and real-time platforms.',
      detailedBio: 'Driven by clean code architecture, developer experience, and continuous learning, with a keen interest in modern Next.js and distributed backend systems.',
      focusAreas: ['Full Stack Development', 'Frontend Architecture', 'Scalable Web Apps', 'Clean Design Systems', 'Modern Stacks'],
      linkedinUrl: 'https://www.linkedin.com/in/ishpreet-singh-cse/',
      contribution: 'Engineered core full-stack platform features, authentication flows, interactive real-time quiz systems, and student community integrations.'
    },
    {
      name: 'Harsh Vardhan Singh',
      role: 'Co-Founder & Data Analyst',
      image: '/team/harsh-vardhan-singh.jpg',
      bio: 'Data-driven technologist passionate about data analytics, business intelligence, pattern recognition, and turning complex data into actionable insights.',
      detailedBio: 'Takes a pragmatic approach to problem-solving, focusing on transforming raw metrics into clear roadmaps that drive community growth and student impact.',
      focusAreas: ['Data Analytics', 'Business Intelligence', 'Data Modeling', 'Pattern Recognition', 'Growth Metrics'],
      linkedinUrl: 'https://www.linkedin.com/in/harshvardhan-singh-57812537a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      contribution: 'Directs community telemetry, analytics evaluation, event engagement metrics, and strategic growth partnership modeling.'
    }
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    soundEffects.playClick();
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === ABOUT_QUIZ_QUESTIONS[currentQuizIdx].correctAnswer;
    if (isCorrect) {
      soundEffects.playSuccess();
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuizIdx < ABOUT_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuizIdx(prev => prev + 1);
      } else {
        setQuizState('finished');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-20">
      {/* 1. HERO STORY OPENING */}
      <section 
        className="glass-card rounded-3xl p-8 sm:p-16 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.18), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 7, 13, 0.98) 100%)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14} /> Our Mission &bull; Founded 2023
        </div>
        <h1 className="text-3xl sm:text-6xl font-black text-white font-display tracking-tight mb-6">
          We Are Building <br />
          <span className="text-gradient">More Than a Community.</span>
        </h1>
        <p className="text-slate-300/85 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
          TYGN (TechYOGeek Nirvana) began with a simple conviction: talented students deserve effortless access to world-class learning resources, hands-on engineering challenges, authentic peer networks, and the personal communication polish needed to excel in the global tech ecosystem.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl font-black text-cyan-400 font-display block">500+</span>
            <span className="text-xs text-slate-400">Student Builders</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl font-black text-indigo-400 font-display block">15+</span>
            <span className="text-xs text-slate-400">Partner Campuses</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl font-black text-emerald-400 font-display block">40+</span>
            <span className="text-xs text-slate-400">Hosted Events</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl font-black text-amber-400 font-display block">60+</span>
            <span className="text-xs text-slate-400">Opportunities Shared</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE TIMELINE */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Historical Evolution
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            The TYGN Journey Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Click through our milestones from inception to today&apos;s holistic ecosystem.
          </p>
        </div>

        {/* Timeline Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-2xl mx-auto">
          {timelineSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playClick();
                setActiveTimelineStep(idx);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTimelineStep === idx
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {step.year}
            </button>
          ))}
        </div>

        {/* Active Timeline Showcase Card */}
        {(() => {
          const step = timelineSteps[activeTimelineStep];
          return (
            <div 
              className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl max-w-3xl mx-auto animate-fadeIn"
              style={{
                background: `radial-gradient(ellipse at top left, ${step.color}15, transparent 65%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(6, 9, 16, 0.95) 100%)`
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">Milestone {activeTimelineStep + 1} of 6</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
                {step.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })()}
      </section>

      {/* 3. INTERACTIVE MINI-GAME: "HOW WELL DO YOU KNOW TYGN?" */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4">
          <HelpCircle size={24} />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
          Interactive About Feature
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
          How Well Do You Know TYGN?
        </h2>

        {quizState === 'intro' && (
          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Test your knowledge of TYGN&apos;s history, vision, and ecosystem in a quick 6-question mini-game to earn your official TYGN Explorer score.
            </p>
            <button
              onClick={() => {
                soundEffects.playClick();
                setQuizState('active');
                setCurrentQuizIdx(0);
                setQuizScore(0);
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 inline-flex items-center gap-2"
            >
              <span>Start Mini-Game</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {quizState === 'active' && (
          <div className="text-left space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
              <span className="font-semibold text-cyan-400">
                Question {currentQuizIdx + 1} of {ABOUT_QUIZ_QUESTIONS.length}
              </span>
              <span className="font-mono">Current Score: {quizScore}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {ABOUT_QUIZ_QUESTIONS[currentQuizIdx].question}
            </h3>

            <div className="space-y-2.5">
              {ABOUT_QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === ABOUT_QUIZ_QUESTIONS[currentQuizIdx].correctAnswer;

                let btnStyle = 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20';
                if (selectedOption !== null) {
                  if (isSelected && isCorrect) btnStyle = 'border-emerald-400 bg-emerald-500/20 text-white';
                  else if (isSelected && !isCorrect) btnStyle = 'border-rose-400 bg-rose-500/20 text-white';
                  else if (isCorrect) btnStyle = 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <p className="text-xs text-slate-300 italic pt-2">
                {ABOUT_QUIZ_QUESTIONS[currentQuizIdx].explanation}
              </p>
            )}
          </div>
        )}

        {quizState === 'finished' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Award size={15} /> Quiz Completed
            </div>

            <h3 className="text-3xl font-black text-white font-display">
              TYGN Explorer Score: <span className="text-cyan-400">{quizScore}</span> / {ABOUT_QUIZ_QUESTIONS.length}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {quizScore >= 5 
                ? 'Outstanding! You have deep mastery of TYGN’s roots, mission, and ecosystem vision.' 
                : 'Good effort! You are officially an active explorer of the TYGN student network.'}
            </p>

            <button
              onClick={() => {
                soundEffects.playClick();
                setQuizState('active');
                setCurrentQuizIdx(0);
                setQuizScore(0);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 inline-flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Try Again
            </button>
          </div>
        )}
      </section>

      {/* 4. AUTHENTIC LEADERSHIP (REAL TEAM ONLY) */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Visionary Leadership
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            The People Behind TYGN
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Student engineers and data practitioners dedicated to building modern tools for learners.
          </p>
        </div>

        {/* Founder Spotlight Card */}
        <div 
          className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl max-w-4xl mx-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(6, 9, 16, 0.98) 100%)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Photo Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 mb-4 p-1 bg-white/5">
                <img 
                  src={founder.image} 
                  alt={founder.name}
                  className="w-full h-full object-cover rounded-2xl" 
                />
              </div>
              <h3 className="text-xl font-bold text-white font-display">{founder.name}</h3>
              <span className="text-xs text-cyan-400 font-semibold mb-3">{founder.role}</span>
              <a 
                href={founder.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:text-white text-xs font-bold transition-colors"
              >
                <LinkedinIcon size={14} color="#38bdf8" />
                <span>LinkedIn Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Bio Column */}
            <div className="md:col-span-8 space-y-4">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {founder.bio}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {founder.detailedBio}
              </p>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Technical Focus:
                </span>
                <div className="flex flex-wrap gap-2">
                  {founder.focusAreas.map((area, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-cyan-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Co-Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {coreTeam.map((member, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-white/5">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-display">{member.name}</h4>
                    <span className="text-xs text-indigo-400 font-semibold block">{member.role}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {member.focusAreas.slice(0, 4).map((f, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Core Leadership</span>
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-white"
                >
                  <LinkedinIcon size={13} color="#00e5ff" />
                  <span>Connect</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PARTNERS & BUILD WITH TYGN CTA */}
      <section 
        className="glass-card rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.12), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 7, 13, 0.98) 100%)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Handshake size={14} /> Ecosystem Alliances
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display mb-4">
          Build With TYGN
        </h2>
        <p className="text-slate-300/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Are you a college tech club, student community, speaker, mentor, or hiring company? Partner with TYGN to host hackathons, share verified opportunities, and empower the next generation of engineers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:techyogeeknirvana@gmail.com?subject=Partnership%20Inquiry%20with%20TYGN"
            onClick={() => soundEffects.playClick()}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
          >
            <Mail size={16} />
            <span>Partner With Us</span>
          </a>

          <a
            href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEffects.playClick()}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 inline-flex items-center gap-2"
          >
            <Users size={16} className="text-emerald-400" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>
      </section>
    </div>
  );
}
