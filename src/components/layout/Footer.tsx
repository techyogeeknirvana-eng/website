'use client';

import React from 'react';
import { 
  Sparkles, 
  Mail, 
  FolderGit2, 
  MessageCircle, 
  Heart,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, #030407 100%)',
        padding: '60px 0 30px 0',
        marginTop: '80px',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-nirvana)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Sparkles size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                TECHYOGEEK <span className="text-gradient">NIRVANA</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              &ldquo;Where Tech Minds Connect, Create & Grow.&rdquo; An AI-powered technology community for learning, opportunities, collaboration and innovation.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://www.linkedin.com/in/techyogeek-nirvana-834b92309/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                title="LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LinkedinIcon size={17} color="#0ea5e9" />
              </a>
              <a
                href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                title="WhatsApp Community"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={17} style={{ color: '#22c55e' }} />
              </a>
              <a
                href="https://www.instagram.com/techyogeek.nirvana"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                title="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InstagramIcon size={17} color="#ec4899" />
              </a>
              <a
                href="mailto:techyogeeknirvana@gmail.com"
                className="btn-ghost"
                title="Email Us"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={17} style={{ color: 'var(--accent-amber)' }} />
              </a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Platform Hubs
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <a href="/community" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Discord-style Community
                </a>
              </li>
              <li>
                <a href="/opportunities" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Jobs & Internships Marketplace
                </a>
              </li>
              <li>
                <a href="/events" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Hackathons & Tech Events
                </a>
              </li>
              <li>
                <a href="/live" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Nirvana Live (Interactive Quizzes)
                </a>
              </li>
              <li>
                <a href="/projects" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Project Showcase Hub
                </a>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              AI Suite
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <a href="/resume-lab" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  AI Resume Lab (ATS Score)
                </a>
              </li>
              <li>
                <a href="/ai-interview" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  AI Interview Room
                </a>
              </li>
              <li>
                <a href="/ai-code" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  AI Code Explainer & Complexity
                </a>
              </li>
              <li>
                <a href="/live/create" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  AI Presentation Generator
                </a>
              </li>
              <li>
                <a href="/roadmaps" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Personalized Tech Roadmaps
                </a>
              </li>
            </ul>
          </div>

          {/* Unique Features & Resources */}
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Ecosystem
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <a href="/about" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  About TYGN (Our Story)
                </a>
              </li>
              <li>
                <a href="/moments" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Nirvana Moments (Milestones)
                </a>
              </li>
              <li>
                <a href="/tech-radar" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Interactive Tech Radar 2026
                </a>
              </li>
              <li>
                <a href="/collab-finder" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none' }}>
                  Collab Finder (Teammates)
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FolderGit2 size={15} style={{ color: 'var(--accent-cyan)' }} />
                  Google Drive Resources <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="/admin" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={15} style={{ color: 'var(--accent-rose)' }} />
                  Admin Moderation Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Techyogeek Nirvana. Connect. Create. Learn. Grow. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built for developers & students with{' '}
            <Heart size={14} style={{ color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
