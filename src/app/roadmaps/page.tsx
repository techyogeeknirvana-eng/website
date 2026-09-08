'use client';

import React, { useState } from 'react';
import { 
  Code, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  ExternalLink,
  Layers,
  Server,
  Layout,
  Clock
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { LearningPath } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function RoadmapsPage() {
  const { currentUser } = useAuth();
  const roadmaps = dbStore.getLearningPaths();
  const [selectedRoadmap, setSelectedRoadmap] = useState<LearningPath>(roadmaps[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([
    'Semantic HTML & WCAG Accessibility',
    'Modern CSS Variables & Theming',
  ]);

  const toggleTopic = (topic: string) => {
    soundEffects.playClick();
    if (completedTopics.includes(topic)) {
      setCompletedTopics(prev => prev.filter(t => t !== topic));
    } else {
      setCompletedTopics(prev => [...prev, topic]);
      soundEffects.playSuccess();
    }
  };

  // Calculate percentage
  const totalTopics = selectedRoadmap.modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedInRoadmap = selectedRoadmap.modules.reduce(
    (acc, m) => acc + m.topics.filter(t => completedTopics.includes(t)).length,
    0
  );
  const progressPercent = Math.round((completedInRoadmap / Math.max(1, totalTopics)) * 100);

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
          Curriculum &amp; Milestones
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Interactive Tech Roadmaps
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Structured, milestone-driven paths designed by industry architects from Beginner to Production Specialist.
        </p>
      </div>

      {/* Path Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {roadmaps.map(r => {
          const isSelected = selectedRoadmap.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedRoadmap(r);
              }}
              className="btn-ghost"
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
              }}
            >
              {r.title}
            </button>
          );
        })}
      </div>

      {/* Roadmap Overview Card */}
      <div
        className="glass-card glow-border"
        style={{
          padding: '28px',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
            {selectedRoadmap.role.toUpperCase()}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{selectedRoadmap.title}</h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
            {selectedRoadmap.description}
          </p>
        </div>

        {/* Progress Metric */}
        <div
          className="glass-card"
          style={{
            padding: '18px 24px',
            textAlign: 'center',
            minWidth: '180px',
            border: '1px solid var(--border-glass)',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {progressPercent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {completedInRoadmap} of {totalTopics} Topics Mastered
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              marginTop: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--gradient-nirvana)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Visual Roadmap Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {selectedRoadmap.modules.map((mod, modIdx) => (
          <div
            key={mod.id}
            className="glass-card"
            style={{
              padding: '30px',
              borderLeft: `5px solid ${mod.level === 'Beginner' ? '#10b981' : mod.level === 'Intermediate' ? '#06b6d4' : '#8b5cf6'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className={`badge ${mod.level === 'Beginner' ? 'badge-emerald' : mod.level === 'Intermediate' ? 'badge-cyan' : 'badge-indigo'}`} style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                  STAGE {modIdx + 1}: {mod.level.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{mod.title}</h3>
              </div>
            </div>

            {/* Checkable Topic Tree */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {mod.topics.map((topic, i) => {
                const isChecked = completedTopics.includes(topic);
                return (
                  <div
                    key={i}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    ) : (
                      <Circle size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isChecked ? 600 : 500,
                        color: isChecked ? 'var(--accent-emerald)' : 'var(--text-primary)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {topic}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Curated Resources */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Recommended Readings &amp; Projects
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {mod.resources.map((res, resIdx) => (
                  <a
                    key={resIdx}
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <BookOpen size={13} style={{ color: 'var(--accent-cyan)' }} />
                    <span>{res.title} ({res.type})</span>
                    <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
