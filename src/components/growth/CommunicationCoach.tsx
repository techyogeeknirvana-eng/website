'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  RefreshCw,
  Lightbulb,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface CoachTip {
  title: string;
  category: string;
  before: string;
  after: string;
  explanation: string;
  toneScore: number;
}

const COACH_TIPS: CoachTip[] = [
  {
    title: 'Transforming Passive Frustration into Clear Status',
    category: 'Workplace Tone',
    before: 'This code is completely broken and nothing works.',
    after: 'I have isolated an issue in the auth flow where tokens are not refreshing properly. Here is the reproduction stack trace.',
    explanation: 'Shifting from emotional catastrophe to objective problem isolation signals technical competence.',
    toneScore: 95
  },
  {
    title: 'Polite Deadline Pushback with Trade-offs',
    category: 'Negotiation Etiquette',
    before: 'Impossible to finish by Friday, give me more time.',
    after: 'To ship with zero regression bugs and full unit tests by Friday, we can either descope the export feature or deliver the full build by Tuesday. Which priority works better for the sprint?',
    explanation: 'Presenting realistic trade-offs instead of flat refusal empowers managers to make informed decisions.',
    toneScore: 98
  },
  {
    title: 'Clarifying Ambiguous Requirements',
    category: 'Active Comprehension',
    before: 'Your requirements make no sense.',
    after: 'Could we walk through the user journey for the checkout step? I want to make sure the edge cases match your product vision.',
    explanation: 'Protects collaboration while ensuring precise architectural specifications.',
    toneScore: 94
  }
];

export function CommunicationCoach() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<{
    tone: string;
    clarityScore: number;
    professionalismScore: number;
    suggestion: string;
    rewrite: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundEffects.playClick();
    setIsAnalyzing(true);

    setTimeout(() => {
      soundEffects.playSuccess();
      const lower = inputText.toLowerCase();

      let clarityScore = 82;
      let professionalismScore = 80;
      let tone = 'Constructive & Direct';
      let suggestion = 'Your message is clear. To maximize professional impact, add collaborative context.';
      let rewrite = inputText;

      if (lower.includes('asap') || lower.includes('fast') || lower.includes('hurry') || lower.includes('urgently')) {
        professionalismScore = 65;
        tone = 'High Urgency / Slightly Demanding';
        suggestion = 'Direct time demands can create defensive stress. Frame urgency with polite justification.';
        rewrite = `When you have a moment, could you please review this? We are finalizing sprint deliverables.`;
      } else if (lower.includes('wrong') || lower.includes('bad') || lower.includes('ugly') || lower.includes('garbage')) {
        professionalismScore = 45;
        tone = 'Confrontational / Critical';
        suggestion = 'Avoid harsh adjectives. Anchor feedback in objective technical standards and specific suggestions.';
        rewrite = `I noticed an opportunity to optimize this flow. Could we explore refactoring the logic together?`;
      } else if (lower.includes('bro') || lower.includes('dude') || lower.includes('hey man')) {
        professionalismScore = 70;
        tone = 'Casual / Peer Level';
        suggestion = 'Warm, but may undermine credibility in external or formal settings. Consider professional greetings.';
        rewrite = `Hi [Name], hope you are doing well. Reaching out regarding our project milestones.`;
      } else {
        clarityScore = 94;
        professionalismScore = 96;
        tone = 'Polished & Collaborative';
        suggestion = 'Excellent executive presence! Clear, courteous, and actionable.';
        rewrite = `Hi [Name], could we review this update at your convenience? Appreciate your guidance on this.`;
      }

      setAnalysis({
        tone,
        clarityScore,
        professionalismScore,
        suggestion,
        rewrite
      });
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
          <Sparkles size={22} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
            Interactive Assistant
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            TYGN Communication Coach
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300/80 mb-6 leading-relaxed">
        Test your drafted Slack messages, interview answers, or emails. The coach analyzes tone, detects friction, and rewrites your communication into executive polish.
      </p>

      {/* Interactive Input Form */}
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="relative">
          <textarea
            rows={3}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g., 'Bro send the code fast, you are delaying our submission.'"
            className="w-full rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors pr-24"
            required
          />
          <button
            type="submit"
            disabled={isAnalyzing || !inputText.trim()}
            className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-xs hover:opacity-95 shadow-md flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            {isAnalyzing ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <>
                <span>Analyze</span>
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Analysis Output */}
      {analysis && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Detected Tone
              </span>
              <span className="text-sm font-bold text-cyan-300">{analysis.tone}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Clarity</span>
                <span className="text-sm font-bold text-white font-mono">{analysis.clarityScore}%</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Polish</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{analysis.professionalismScore}%</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs font-bold text-slate-300 block mb-1">
              Coach Assessment:
            </span>
            <p className="text-xs text-slate-300/90 leading-relaxed">
              {analysis.suggestion}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1 flex items-center gap-1.5">
              <Lightbulb size={13} /> Recommended Executive Rewrite
            </span>
            <p className="text-xs text-white font-medium italic">
              &ldquo;{analysis.rewrite}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Exemplar Tips Grid */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Executive Transformation Blueprints
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COACH_TIPS.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                {tip.category}
              </span>
              <h5 className="text-xs font-bold text-white mb-2">{tip.title}</h5>
              
              <div className="text-[11px] space-y-1.5 mb-2">
                <div className="text-rose-300 line-through opacity-75">
                  &ldquo;{tip.before}&rdquo;
                </div>
                <div className="text-emerald-300 font-medium">
                  &ldquo;{tip.after}&rdquo;
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{tip.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
