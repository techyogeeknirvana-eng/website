'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Check, 
  RotateCcw,
  Lightbulb,
  ArrowRight
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
    explanation: 'Shifting from emotional catastrophe to objective problem isolation signals technical maturity.',
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

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundEffects.playClick();
    const lower = inputText.toLowerCase();

    let tone = 'Diplomatic & Direct';
    let clarity = 88;
    let professionalism = 85;
    let suggestion = 'Solid statement structure. Maintain concise phrasing.';
    let rewrite = inputText;

    if (lower.includes('asap') || lower.includes('hurry') || lower.includes('right now') || lower.includes('fast')) {
      tone = 'Urgent / Blunt';
      clarity = 72;
      professionalism = 60;
      suggestion = 'Avoid demanding acronyms like "ASAP". State the actual constraint and request assistance politely.';
      rewrite = `Could you please share this when you get a moment? We need it to finalize the milestone by end of day.`;
    } else if (lower.includes('stupid') || lower.includes('broken') || lower.includes('dumb') || lower.includes('hate')) {
      tone = 'Emotionally Charged';
      clarity = 55;
      professionalism = 45;
      suggestion = 'Remove subjective frustration. Frame the technical friction objectively with logs or reproduction steps.';
      rewrite = `I am running into unexpected behavior in this module. Could we review the test assertions together?`;
    } else if (lower.includes('sorry') && lower.split('sorry').length > 2) {
      tone = 'Excessively Apologetic';
      clarity = 70;
      professionalism = 68;
      suggestion = 'Repeatedly apologizing reduces executive presence. Replace apologies with gratitude for cooperation.';
      rewrite = `Thank you for your patience on this review. The updated patches are live on the branch.`;
    } else {
      rewrite = `Regarding our discussion: ${inputText.trim().replace(/\.$/, '')}. Please let me know your thoughts so we can align next steps.`;
    }

    setAnalysis({
      tone,
      clarityScore: clarity,
      professionalismScore: professionalism,
      suggestion,
      rewrite
    });
  };

  return (
    <div className="mono-card p-6 sm:p-12 space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div className="space-y-3">
        <div className="editorial-eyebrow">
          EXECUTIVE PHRASE ARCHITECT // TONE ANALYZER
        </div>
        <h3 className="editorial-title text-2xl sm:text-4xl text-inherit">
          Communication Coach
        </h3>
        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed max-w-xl">
          Paste any message you plan to send to a teammate, professor, recruiter, or manager. The engine evaluates tone, isolates friction, and generates an executive rewrite.
        </p>
      </div>

      {/* Input Analyzer Form */}
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#737373]">
            Draft Phrase or Message:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Send me the file ASAP, we are already late."
            rows={3}
            className="w-full text-xs sm:text-sm font-sans"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['Send me file ASAP', 'This code makes no sense', 'Sorry for asking but'].map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(sample)}
                className="hidden sm:inline-block text-[0.68rem] font-mono px-2 py-1 rounded border border-white/10 text-[#737373] hover:text-white"
              >
                Sample: &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2"
          >
            <span>Analyze Phrase</span>
            <Send size={13} />
          </button>
        </div>
      </form>

      {/* Analysis Output */}
      {analysis && (
        <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-6 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Detected Tone Profile</div>
              <div className="font-display font-bold text-lg text-inherit mt-0.5">{analysis.tone}</div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Clarity</div>
                <div className="font-display font-black text-xl text-inherit">{analysis.clarityScore}%</div>
              </div>
              <div>
                <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Professionalism</div>
                <div className="font-display font-black text-xl text-inherit">{analysis.professionalismScore}%</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-[#737373]">Coach Insight</div>
            <p className="text-xs sm:text-sm text-inherit leading-relaxed">
              {analysis.suggestion}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.02] space-y-1.5">
            <div className="text-[0.68rem] font-mono uppercase text-inherit font-bold">
              Executive Rewrite // Ready to Send:
            </div>
            <p className="text-xs sm:text-sm text-inherit italic leading-relaxed">
              &ldquo;{analysis.rewrite}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Curated Field Insights */}
      <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
        <div className="text-xs font-mono font-bold uppercase text-[#737373]">
          Engineering Communication Case Studies
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COACH_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[0.65rem] font-mono uppercase text-[#737373]">{tip.category}</span>
                <h4 className="font-display font-bold text-xs sm:text-sm text-inherit">{tip.title}</h4>
                <div className="text-[0.72rem] text-[#737373] line-through">&ldquo;{tip.before}&rdquo;</div>
                <div className="text-[0.75rem] text-inherit font-medium">&ldquo;{tip.after}&rdquo;</div>
              </div>
              <p className="text-[0.7rem] text-[#737373] pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10 leading-relaxed">
                {tip.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
