'use client';

import React, { useState } from 'react';
import { 
  Code, 
  Sparkles, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { aiService } from '@/lib/ai/aiService';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function AICodeExplainerPage() {
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState(`async function fetchUserData(userId: string) {
  const res = await fetch(\`/api/users/\${userId}\`);
  const data = await res.json();
  
  const formattedOrders = [];
  for (let i = 0; i < data.orders.length; i++) {
    for (let j = 0; j < data.orders[i].items.length; j++) {
      formattedOrders.push(data.orders[i].items[j].sku);
    }
  }
  return { ...data, formattedOrders };
}`);

  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<{
    summary: string;
    timeComplexity: string;
    spaceComplexity: string;
    bugsOrRisks: string[];
    improvements: string[];
  } | null>(null);

  const handleExplain = async () => {
    if (!code.trim()) return;
    soundEffects.playClick();
    setIsExplaining(true);

    try {
      const result = await aiService.explainCode(code, language);
      setExplanation(result);
      soundEffects.playSuccess();
    } catch {
      alert('Explanation failed.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px', maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-violet" style={{ marginBottom: '8px' }}>
          Code Intelligence
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          AI Code Explainer &amp; Complexity Analyzer
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Paste code in any programming language. Uncover algorithmic Big-O bottlenecks, edge-case bug risks, and modernization refactorings.
        </p>
      </div>

      {/* Editor Box */}
      <div className="glass-card" style={{ padding: '26px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
            <Code size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span>Source Code</span>
          </div>

          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              background: '#0d121d',
              color: '#fff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.84rem',
            }}
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <textarea
          rows={12}
          value={code}
          onChange={e => setCode(e.target.value)}
          className="input-custom"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            resize: 'vertical',
            marginBottom: '16px',
            background: '#0a0d14',
          }}
        />

        <button
          onClick={handleExplain}
          disabled={isExplaining || !code.trim()}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
        >
          {isExplaining ? 'Analyzing AST & Algorithmic Complexity...' : 'Explain Code & Find Bottlenecks'}
        </button>
      </div>

      {/* Analysis Results Display */}
      {explanation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Complexity Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-card glow-border" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {explanation.timeComplexity}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '6px' }}>Time Complexity (Big-O)</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Execution speed scaling</div>
            </div>

            <div className="glass-card glow-border" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {explanation.spaceComplexity}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '6px' }}>Space Complexity (Auxiliary)</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Memory footprint allocation</div>
            </div>
          </div>

          {/* Logic Summary */}
          <div className="glass-card" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-indigo)' }} /> Architectural Breakdown
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {explanation.summary}
            </p>
          </div>

          {/* Bugs & Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)' }}>
                <AlertTriangle size={16} /> Potential Bugs &amp; Edge Cases
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {explanation.bugsOrRisks.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-rose)' }}>•</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={16} /> Modern Refactoring Suggestions
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {explanation.improvements.map((imp, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-emerald)' }}>•</span> {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
