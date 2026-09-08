'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  User as UserIcon, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  Code,
  Shield,
  Award
} from 'lucide-react';
import { aiService } from '@/lib/ai/aiService';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface InterviewTurn {
  question: string;
  userAnswer?: string;
  feedback?: {
    score: number;
    feedback: string;
    strengths: string[];
    missingPoints: string[];
  };
}

export default function AIInterviewPage() {
  const { currentUser } = useAuth();
  const [role, setRole] = useState('Frontend Engineer (React / Next.js)');
  const [experience, setExperience] = useState('Entry-Level / 0 - 2 Years');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [turns, setTurns] = useState<InterviewTurn[]>([
    {
      question: 'Welcome to your technical mock interview! Let’s start: Can you explain how the Virtual DOM diffing algorithm works in React, and how React 19 handles optimistic state updates without unnecessary re-renders?',
    }
  ]);

  const handleStartInterview = () => {
    soundEffects.playSuccess();
    setSessionStarted(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || isEvaluating) return;
    soundEffects.playClick();
    setIsEvaluating(true);

    const currentTurn = turns[turns.length - 1];

    try {
      const evaluation = await aiService.evaluateInterviewAnswer(
        currentTurn.question,
        answerInput.trim(),
        role
      );

      soundEffects.playSuccess();

      const updatedTurns: InterviewTurn[] = [
        ...turns.slice(0, turns.length - 1),
        {
          question: currentTurn.question,
          userAnswer: answerInput.trim(),
          feedback: {
            score: evaluation.score,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            missingPoints: evaluation.missingPoints,
          },
        },
        {
          question: evaluation.followUpQuestion,
        }
      ];

      setTurns(updatedTurns);
      setAnswerInput('');
    } catch {
      alert('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
          Interactive Simulation
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          AI Interview Room
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time conversational mock technical interview. Get evaluated on technical depth, clarity, and system trade-offs.
        </p>
      </div>

      {!sessionStarted ? (
        /* Configuration Screen */
        <div
          className="glass-card glow-border"
          style={{
            padding: '36px',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Configure Your Session</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Choose your target engineering role and seniority level to tailor questions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Engineering Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-custom"
                style={{ background: '#0d121d' }}
              >
                <option value="Frontend Engineer (React / Next.js)">Frontend Engineer (React / Next.js)</option>
                <option value="Backend Engineer (Go / Distributed Systems)">Backend Engineer (Go / Distributed Systems)</option>
                <option value="AI / Machine Learning Engineer (PyTorch / LLMs)">AI / Machine Learning Engineer (PyTorch / LLMs)</option>
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="Cybersecurity / AppSec Specialist">Cybersecurity / AppSec Specialist</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Experience Tier
              </label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="input-custom"
                style={{ background: '#0d121d' }}
              >
                <option value="Internship / College Student">Internship / College Student</option>
                <option value="Entry-Level / 0 - 2 Years">Entry-Level / 0 - 2 Years</option>
                <option value="Mid-Level / 2 - 5 Years">Mid-Level / 2 - 5 Years</option>
                <option value="Senior / Staff Engineer">Senior / Staff Engineer</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            Start Mock Interview Session <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        /* Active Interview Dialogue Feed */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {turns.map((turn, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Interviewer Bot Question */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  gap: '14px',
                  borderLeft: '4px solid var(--accent-indigo)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--gradient-nirvana)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-indigo)', fontWeight: 700, marginBottom: '4px' }}>
                    TECHNICAL INTERVIEWER • QUESTION #{i + 1}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.45 }}>
                    {turn.question}
                  </div>
                </div>
              </div>

              {/* User Answer (if submitted) */}
              {turn.userAnswer && (
                <div
                  className="glass-card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    gap: '14px',
                    marginLeft: '24px',
                    background: 'rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <UserIcon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                      YOUR RESPONSE
                    </div>
                    <div style={{ fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {turn.userAnswer}
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation Feedback (if evaluated) */}
              {turn.feedback && (
                <div
                  className="glass-card glow-border"
                  style={{
                    padding: '24px',
                    marginLeft: '24px',
                    border: '1px solid var(--border-glow)',
                    background: 'rgba(16, 185, 129, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      <CheckCircle2 size={18} /> Answer Evaluation
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.85rem' }}>
                      {turn.feedback.score} / 100 PTS
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {turn.feedback.feedback}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '4px' }}>
                        STRENGTHS
                      </div>
                      {turn.feedback.strengths.map((s, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {s}</div>
                      ))}
                    </div>

                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '4px' }}>
                        WHAT TO EXPAND NEXT TIME
                      </div>
                      {turn.feedback.missingPoints.map((m, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {m}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Answer Input Field for the Latest Question */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
              Your Response
            </label>
            <textarea
              rows={4}
              placeholder="Type your structured technical explanation..."
              value={answerInput}
              onChange={e => setAnswerInput(e.target.value)}
              className="input-custom"
              style={{ marginBottom: '16px' }}
            />

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || !answerInput.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {isEvaluating ? (
                <>
                  <RefreshCw size={16} className="animate-pulse" /> Evaluating Response...
                </>
              ) : (
                <>
                  Submit Answer for AI Scoring <Send size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
