'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface SimulationScenario {
  id: string;
  role: string;
  mode: string;
  interviewerPrompt: string;
  context: string;
}

const SIMULATION_MODES: SimulationScenario[] = [
  {
    id: 'interview-intro',
    role: 'Staff Engineering Lead',
    mode: 'Technical Screening',
    interviewerPrompt: 'Tell me about yourself, what you have built recently, and the toughest engineering trade-off you had to make.',
    context: 'First 5 minutes of a Senior/Junior Frontend role technical screening.'
  },
  {
    id: 'manager-timeline',
    role: 'Engineering Manager',
    mode: '1-on-1 Sprint Check-in',
    interviewerPrompt: 'The sprint deadline is in 48 hours and the authentication integration is blocked by upstream API delays. What is your plan to prevent milestone slip?',
    context: 'High-stakes delivery check-in assessing trade-off communication.'
  },
  {
    id: 'pr-disagreement',
    role: 'Senior Tech Lead',
    mode: 'Architecture Debate',
    interviewerPrompt: 'I left 8 requested changes on your pull request advising against client-side state caching. Why do you believe your approach is better suited here?',
    context: 'Technical dispute requiring constructive, ego-free defense with data.'
  }
];

export function ConversationSimulator() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SIMULATION_MODES[0].id);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState<{
    clarity: number;
    confidence: number;
    professionalism: number;
    conciseness: number;
    feedback: string;
    keyTakeaway: string;
  } | null>(null);

  const scenario = SIMULATION_MODES.find(s => s.id === activeScenarioId) || SIMULATION_MODES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;

    soundEffects.playSuccess();
    const len = userResponse.trim().length;
    const lower = userResponse.toLowerCase();

    let clarity = 84;
    let confidence = 80;
    let professionalism = 90;
    let conciseness = 78;
    let feedback = '';
    let takeaway = '';

    if (len < 50) {
      clarity = 60;
      confidence = 55;
      conciseness = 95;
      professionalism = 70;
      feedback = 'Response is too brief for an executive technical scenario. Expand on concrete trade-offs, metrics, or technical rationale.';
      takeaway = 'Structure technical responses with the STAR method (Situation, Task, Action, Result).';
    } else if (lower.includes('i think maybe') || lower.includes('probably') || lower.includes('not sure')) {
      clarity = 75;
      confidence = 58;
      professionalism = 78;
      conciseness = 80;
      feedback = 'Phrasing contains hedging words ("maybe", "probably", "not sure") which erode perceived engineering authority.';
      takeaway = 'State technical findings directly: "Based on our latency profiling, client-side caching yields 200ms faster TTFB."';
    } else {
      clarity = 88;
      confidence = 85;
      professionalism = 92;
      conciseness = 84;
      feedback = 'Well-structured response. Demonstrates objective technical problem-solving and respects stakeholder constraints.';
      takeaway = 'High-performing engineers present options with clear pros and cons instead of defensive debate.';
    }

    setEvaluation({
      clarity,
      confidence,
      professionalism,
      conciseness,
      feedback,
      keyTakeaway: takeaway
    });
  };

  const handleReset = () => {
    soundEffects.playClick();
    setUserResponse('');
    setEvaluation(null);
  };

  return (
    <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div>
          <div className="editorial-eyebrow">
            TYGN SIMULATION ARENA // ROLEPLAY ENGINE
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit mt-1">
            {scenario.mode}
          </h3>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] border border-white/10 dark:border-white/10 light:border-black/10">
          {SIMULATION_MODES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveScenarioId(s.id);
                setUserResponse('');
                setEvaluation(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeScenarioId === s.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-[#737373] hover:text-white dark:hover:text-white light:hover:text-black'
              }`}
            >
              {s.mode}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Terminal Dialog */}
      <div className="space-y-6">
        {/* Interviewer Speech Bubble */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-inherit">
            <Bot size={18} />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-inherit">{scenario.role}</span>
              <span className="text-[0.65rem] font-mono text-[#737373]">Interviewer</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] text-xs sm:text-sm text-inherit leading-relaxed">
              &ldquo;{scenario.interviewerPrompt}&rdquo;
            </div>
          </div>
        </div>

        {/* User Input or Submitted Response */}
        {!evaluation ? (
          <form onSubmit={handleSubmit} className="space-y-4 pl-0 sm:pl-13">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#737373] block">
                Your Spoken or Written Response:
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your structured response to the interviewer..."
                rows={4}
                className="w-full text-xs sm:text-sm font-sans"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] text-[#737373]">
                AI Evaluator evaluates Clarity, Confidence, and Professionalism metrics
              </span>
              <button
                type="submit"
                className="btn btn-primary text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2"
              >
                <span>Submit Response</span>
                <Send size={13} />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 pl-0 sm:pl-13">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-[#737373]">You Answered:</div>
              <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-xs sm:text-sm text-inherit leading-relaxed">
                &ldquo;{userResponse}&rdquo;
              </div>
            </div>

            {/* Evaluation Score Metrics (Strict Monochrome) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
                <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Clarity</div>
                <div className="font-display font-black text-2xl text-inherit">{evaluation.clarity}%</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
                <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Confidence</div>
                <div className="font-display font-black text-2xl text-inherit">{evaluation.confidence}%</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
                <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Professional</div>
                <div className="font-display font-black text-2xl text-inherit">{evaluation.professionalism}%</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
                <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Conciseness</div>
                <div className="font-display font-black text-2xl text-inherit">{evaluation.conciseness}%</div>
              </div>
            </div>

            {/* Detailed Coaching Insights */}
            <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-inherit">
                Simulator Assessment
              </div>
              <p className="text-xs sm:text-sm text-inherit leading-relaxed">
                {evaluation.feedback}
              </p>
              <div className="pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10 text-xs text-[#a3a3a3]">
                <strong>Core Takeaway:</strong> {evaluation.keyTakeaway}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="btn btn-secondary text-xs py-2.5 px-5 font-semibold inline-flex items-center gap-2"
              >
                <RotateCcw size={13} />
                <span>Try Another Response</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
