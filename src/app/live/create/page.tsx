'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  ArrowLeft, 
  Radio, 
  HelpCircle, 
  BarChart3, 
  Cloud, 
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { aiService } from '@/lib/ai/aiService';
import { QuizQuestion, SlideType } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CreateLiveDeckPage() {
  return (
    <ProtectedRoute>
      <CreateLiveDeckContent />
    </ProtectedRoute>
  );
}

function CreateLiveDeckContent() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [topicPrompt, setTopicPrompt] = useState('Full Stack & Cloud Native Architecture');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [deckTitle, setDeckTitle] = useState('Full Stack & Cloud Native Architecture Masterclass');
  const [deckDescription, setDeckDescription] = useState('Interactive audience quiz and live polls on Next.js 15, container orchestration, and serverless scale.');
  const [slides, setSlides] = useState<QuizQuestion[]>([
    {
      id: 's_1',
      type: 'quiz',
      question: 'Which HTTP status code is returned by an API when a rate limit is exceeded?',
      options: ['401 Unauthorized', '403 Forbidden', '429 Too Many Requests', '503 Service Unavailable'],
      correctAnswer: 2,
      explanation: 'HTTP 429 indicates the client has sent too many requests in a given amount of time ("rate limiting").',
      timeLimitSeconds: 20,
      points: 1000,
    },
    {
      id: 's_2',
      type: 'poll',
      question: 'Which cloud provider do you deploy to most frequently?',
      options: ['AWS', 'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Vercel / Cloudflare'],
      timeLimitSeconds: 20,
      points: 250,
    },
    {
      id: 's_3',
      type: 'word_cloud',
      question: 'What is the #1 technology you plan to master this year?',
      options: [],
      timeLimitSeconds: 25,
      points: 250,
    },
  ]);

  const handleAiGenerate = async () => {
    if (!topicPrompt.trim()) return;
    setIsAiGenerating(true);
    soundEffects.playClick();

    try {
      const generated = await aiService.generatePresentation(topicPrompt);
      setDeckTitle(generated.title);
      setDeckDescription(`AI-generated interactive session on ${topicPrompt} with embedded live polls, check-in quizzes, and speaker notes.`);
      setSlides(generated.slides);
      soundEffects.playSuccess();
    } catch {
      alert('Failed to generate presentation. Please try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddSlide = (type: SlideType) => {
    soundEffects.playClick();
    const newSlide: QuizQuestion = {
      id: 'slide_' + Date.now(),
      type,
      question: type === 'word_cloud' ? 'Submit your thoughts in one word:' : 'Enter your question title here...',
      options: type === 'quiz' ? ['Option A', 'Option B', 'Option C', 'Option D'] : type === 'poll' ? ['Yes', 'No', 'Maybe'] : [],
      correctAnswer: type === 'quiz' ? 0 : undefined,
      explanation: 'Explanation of why this answer is correct.',
      timeLimitSeconds: 20,
      points: type === 'quiz' ? 1000 : 250,
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const handleRemoveSlide = (idx: number) => {
    soundEffects.playClick();
    setSlides(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLaunchLive = () => {
    if (!currentUser) return;
    if (slides.length === 0) {
      alert('Please add at least 1 slide to launch.');
      return;
    }

    soundEffects.playSuccess();

    const createdQuiz = dbStore.addQuiz(
      {
        title: deckTitle,
        topic: topicPrompt || 'General Tech',
        difficulty: 'intermediate',
        description: deckDescription,
        questions: slides,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
      },
      currentUser
    );

    const session = dbStore.createLiveSession(createdQuiz, currentUser);
    router.push(`/live/host/${session.code}`);
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '860px' }}>
      <button
        onClick={() => router.back()}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Live Hub
      </button>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-rose" style={{ marginBottom: '8px' }}>
          Interactive Deck Creator
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Create Live Quiz &amp; Presentation</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Combine slides, multiple-choice quizzes, word clouds, and audience polls. Use AI to create instant decks.
        </p>
      </div>

      {/* AI Presentation Generator Box */}
      <div
        className="glass-card glow-border"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(13, 18, 29, 0.9), rgba(99, 102, 241, 0.15))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span>AI Presentation &amp; Quiz Generator</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Enter any topic or tech concept. AI will automatically generate title, interactive slides, audience polls, and questions!
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="e.g. Generative AI for beginners, Docker &amp; Kubernetes, System Design..."
            value={topicPrompt}
            onChange={e => setTopicPrompt(e.target.value)}
            className="input-custom"
            style={{ flex: 1, minWidth: '240px' }}
          />
          <button
            onClick={handleAiGenerate}
            disabled={isAiGenerating || !topicPrompt.trim()}
            className="btn btn-primary"
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
          >
            {isAiGenerating ? 'Synthesizing Deck...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      {/* Deck Metadata Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Deck Title
          </label>
          <input
            type="text"
            value={deckTitle}
            onChange={e => setDeckTitle(e.target.value)}
            className="input-custom"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Session Description
          </label>
          <input
            type="text"
            value={deckDescription}
            onChange={e => setDeckDescription(e.target.value)}
            className="input-custom"
          />
        </div>
      </div>

      {/* Slides Builder List */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Slides &amp; Interactive Moments ({slides.length})
          </h3>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleAddSlide('quiz')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <HelpCircle size={14} style={{ color: 'var(--accent-indigo)' }} /> + Quiz
            </button>
            <button
              onClick={() => handleAddSlide('poll')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <BarChart3 size={14} style={{ color: 'var(--accent-cyan)' }} /> + Poll
            </button>
            <button
              onClick={() => handleAddSlide('word_cloud')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Cloud size={14} style={{ color: 'var(--accent-amber)' }} /> + Word Cloud
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className="glass-card"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${s.type === 'quiz' ? 'var(--accent-indigo)' : s.type === 'poll' ? 'var(--accent-cyan)' : s.type === 'word_cloud' ? 'var(--accent-amber)' : 'var(--accent-violet)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge" style={{ fontWeight: 800 }}>
                    SLIDE {idx + 1}
                  </span>
                  <span
                    className={`badge ${s.type === 'quiz' ? 'badge-indigo' : s.type === 'poll' ? 'badge-cyan' : 'badge-amber'}`}
                  >
                    {s.type.toUpperCase().replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {s.timeLimitSeconds}s
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveSlide(idx)}
                  className="btn-ghost"
                  style={{ color: 'var(--accent-rose)', padding: '4px' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <input
                type="text"
                value={s.question}
                onChange={e => {
                  const updated = [...slides];
                  updated[idx].question = e.target.value;
                  setSlides(updated);
                }}
                className="input-custom"
                style={{ fontWeight: 700, marginBottom: '12px' }}
              />

              {/* Options for quiz or poll */}
              {s.options.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {s.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: optIdx === s.correctAnswer && s.type === 'quiz' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: optIdx === s.correctAnswer && s.type === 'quiz' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const updated = [...slides];
                          updated[idx].options[optIdx] = e.target.value;
                          setSlides(updated);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: 'var(--text-primary)',
                          fontSize: '0.84rem',
                          flex: 1,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {s.type === 'word_cloud' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                  Participants submit single-word answers which dynamically enlarge based on frequency.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Launch Action */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid var(--border-glow)',
        }}
      >
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Ready to Host?</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Launches a live session with an auto-generated 6-digit PIN and QR code.
          </div>
        </div>

        <button
          onClick={handleLaunchLive}
          className="btn btn-primary"
          style={{ padding: '12px 28px', fontSize: '1rem' }}
        >
          <Play size={16} /> Start Live Session
        </button>
      </div>
    </div>
  );
}
