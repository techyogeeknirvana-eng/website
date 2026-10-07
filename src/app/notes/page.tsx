'use client';

import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  FolderDown,
  ArrowRight,
  GraduationCap,
  HardDrive
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function NotesDrivePage() {
  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA';
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(DRIVE_FOLDER_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const semesters = [
    { sem: 'Semester 1 & 2', desc: 'Applied Physics, Calculus, C Programming, Engineering Chemistry, Basic Electrical' },
    { sem: 'Semester 3 & 4', desc: 'Data Structures, Discrete Mathematics, OOP (Java/C++), Computer Organization, DBMS' },
    { sem: 'Semester 5 & 6', desc: 'Operating Systems, Computer Networks, Software Engineering, Web Dev, AI & ML' },
    { sem: 'Semester 7 & 8', desc: 'Cloud Computing, Compiler Design, Distributed Systems, Capstone Projects' },
  ];

  return (
    <ProtectedRoute>
      <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-12 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="editorial-eyebrow">
            OFFICIAL B.TECH ACADEMIC REPOSITORY
          </div>
          <h1 className="editorial-title text-4xl sm:text-6xl">
            B.Tech Curriculum Notes Drive
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
            All syllabus, handwritten notes, previous years&apos; question papers (PYQs), and laboratory code files centralized in one verified repository for all 8 engineering semesters.
          </p>
        </div>

        {/* Direct Connect Card */}
        <div className="mono-card p-8 sm:p-14 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-inherit">
            <HardDrive size={32} />
          </div>

          <div className="space-y-2">
            <span className="mono-badge text-xs py-0.5 px-3">
              OFFICIAL VERIFIED REPOSITORY
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-inherit">
              Connect to B.Tech Drive
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] max-w-lg mx-auto leading-relaxed">
              Direct access to the comprehensive repository containing 450+ curated documents, question banks, and lecture files.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playSuccess()}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 font-bold inline-flex items-center gap-2 no-underline"
            >
              <FolderDown size={18} />
              <span>Open Google Drive Folder</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handleCopyLink}
              className="btn btn-secondary text-xs sm:text-sm py-3 px-5 font-semibold inline-flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Link Copied!' : 'Copy Drive Link'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] max-w-lg mx-auto flex items-center justify-between text-xs font-mono text-[#a3a3a3]">
            <span className="truncate pr-2">{DRIVE_FOLDER_URL}</span>
            <span className="shrink-0 text-inherit font-bold">Official</span>
          </div>
        </div>

        {/* Semester Structure Overview */}
        <div className="space-y-4">
          <div className="editorial-eyebrow">
            ORGANIZED SEMESTER ARCHITECTURE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {semesters.map((s, idx) => (
              <div 
                key={idx}
                className="mono-card p-6 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
                  <span>0{idx + 1}</span>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">Verified PYQs</span>
                </div>
                <h3 className="font-display font-bold text-lg text-inherit">
                  {s.sem}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
