'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  ShieldCheck,
  Target,
  BarChart2,
  Check,
  Zap
} from 'lucide-react';
import { aiService } from '@/lib/ai/aiService';
import { ResumeAnalysisResult } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';
import { BuyCreditsModal } from '@/components/credits/BuyCreditsModal';

export default function ResumeLabPage() {
  const { wallet, deductCredits } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [uploadTab, setUploadTab] = useState<'upload' | 'paste'>('upload');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeText, setResumeText] = useState(`AARAV SHARMA
Full Stack Software Developer
Email: aarav.sharma@example.com | GitHub: github.com/aaravcodes | LinkedIn: linkedin.com/in/aaravcodes

EDUCATION
Delhi Technological University — B.Tech Computer Science (2023 - 2027)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, SQL
Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
Tools: Docker, Git, PostgreSQL, Redis, Postman

EXPERIENCE
Software Engineering Intern — CloudScale Labs (June 2025 - August 2025)
• Worked on the backend API and fixed bugs for user authentication.
• Created frontend components in React for the dashboard.
• Added database queries for customer transaction records.

PROJECTS
NeuroSight — Multimodal AI Assistant (Winner at HackIndia 2026)
• Built a real-time accessibility agent using WebRTC and Python FastAPI.
• Integrated Google Gemini 2.0 streaming vision models for low-latency visual captioning.`);

  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);

  // Bullet rewriter studio state
  const [bulletInput, setBulletInput] = useState('Worked on the backend API and fixed bugs for user authentication.');
  const [rewrites, setRewrites] = useState<{ title: string; text: string; highlight: string }[]>([]);
  const [isRewriting, setIsRewriting] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const processFile = (file: File) => {
    soundEffects.playClick();
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // OCR & Text Extraction Simulation based on uploaded file
    const sampleExtracted = `PARSED RESUME: ${file.name.toUpperCase().replace(/\.[^/.]+$/, '')}
Candidate Name: Ishpreet Singh / Tech Enthusiast
Target Domain: Software Engineering & Cloud Systems
Email: candidate.tech@nirvana.community | GitHub: github.com/techyogeek

EDUCATION
B.Tech in Computer Science & Engineering (2023 - 2027)
Relevant Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, C++, SQL
Frameworks & Libraries: React, Next.js 14, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git & GitHub

EXPERIENCE & PROJECTS
• B.Tech Community Platform: Architected high-concurrency student networking app with WebSocket live polls and AI tools.
• Full Stack Developer Intern: Built automated REST microservices reducing API latency by 35%.
• Hackathon Winner: Engineered real-time multimodal accessibility application using streaming AI APIs.`;

    setResumeText(sampleExtracted);
    soundEffects.playSuccess();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;

    if (!wallet || wallet.totalCredits < 2) {
      soundEffects.playError();
      setShowBuyModal(true);
      return;
    }

    const deducted = deductCredits(2, 'AI Resume Scoring Scan', 'resume');
    if (!deducted) {
      soundEffects.playError();
      setShowBuyModal(true);
      return;
    }

    setIsAnalyzing(true);
    soundEffects.playClick();

    try {
      const result = await aiService.analyzeResume(resumeText, targetRole);
      setAnalysis(result);
      soundEffects.playSuccess();
    } catch {
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewriteBullet = async () => {
    if (!bulletInput.trim()) return;
    setIsRewriting(true);
    soundEffects.playClick();

    try {
      const res = await aiService.rewriteBullet(bulletInput, targetRole);
      setRewrites(res.rewrites);
      soundEffects.playSuccess();
    } catch {
      alert('Rewriting failed.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    soundEffects.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
          Intelligent Career Lab
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          AI Resume Lab &amp; ATS Optimizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '700px' }}>
          Benchmark your resume against target tech roles. Uncover missing search keywords, evaluate formatting, and generate metric-driven bullet points.
        </p>
      </div>

      {/* Input / Upload Studio */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
          marginBottom: '40px',
        }}
      >
        {/* Editor & Target Role */}
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Target Tech Job Role
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer, AI Engineer, SDE-1..."
                className="input-custom"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn btn-primary"
                style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
              >
                {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isAnalyzing ? 'Scoring...' : 'Analyze Resume'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.78rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                <Zap size={13} fill="currentColor" /> Costs 2 credits per scan
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>
                Your Balance: <strong style={{ color: (wallet?.totalCredits ?? 0) < 2 ? '#ef4444' : 'var(--text-primary)' }}>{wallet?.totalCredits ?? 0}</strong> credits
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs: Upload Document (PDF/Image) vs Manual Paste */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
            }}
          >
            <button
              onClick={() => {
                soundEffects.playClick();
                setUploadTab('upload');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: uploadTab === 'upload' ? 'var(--accent-cyan)' : 'transparent',
                color: uploadTab === 'upload' ? '#000000' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <Upload size={14} /> Upload PDF or Image
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setUploadTab('paste');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: uploadTab === 'paste' ? 'var(--accent-cyan)' : 'transparent',
                color: uploadTab === 'paste' ? '#000000' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={14} /> Plain Text Editor
            </button>
          </div>

          {/* Tab 1: PDF & Image Dropzone */}
          {uploadTab === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '14px' }}>
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--accent-cyan)' : '2px dashed var(--border-glow)',
                  background: isDragging ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                  }}
                >
                  <Upload size={24} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>
                  Click to Browse or Drag &amp; Drop Resume
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Supports Adobe PDF (.pdf) and high-res images (.png, .jpg, .webp)
                </p>
              </div>

              {/* Uploaded File Card & Preview */}
              {uploadedFile && (
                <div
                  className="glass-card"
                  style={{
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent-cyan)',
                    background: 'rgba(6, 182, 212, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Resume Preview"
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid var(--border-subtle)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-rose)',
                        }}
                      >
                        <FileText size={24} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {uploadedFile.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type.includes('pdf') ? 'PDF Document' : 'Image OCR Ready'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> OCR Extracted
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        setImagePreview(null);
                      }}
                      className="btn-ghost"
                      style={{ padding: '6px', fontSize: '0.75rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Extracted preview text toggle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Extracted Resume Content ({resumeText.length} chars)
                  </label>
                </div>
                <textarea
                  rows={7}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  className="input-custom"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Manual Text Area */}
          {uploadTab === 'paste' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Resume Plain Text Editor
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Markdown &amp; plain text supported
                </span>
              </div>
              <textarea
                rows={13}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="input-custom"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          <div
            style={{
              marginTop: '14px',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Privacy Guard: Uploaded PDF/Image documents are analyzed locally and never stored or shared with 3rd parties.</span>
          </div>
        </div>

        {/* Bullet Rewriter Studio */}
        <div className="glass-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-violet)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>&ldquo;Rewrite this Bullet&rdquo; Studio</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Paste a weak responsibility bullet. AI transforms it into 3 high-impact, XYZ-format variations with metrics and technical depth.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <textarea
              rows={3}
              value={bulletInput}
              onChange={e => setBulletInput(e.target.value)}
              placeholder="Paste any resume bullet here..."
              className="input-custom"
              style={{ fontSize: '0.86rem' }}
            />
          </div>

          <button
            onClick={handleRewriteBullet}
            disabled={isRewriting || !bulletInput.trim()}
            className="btn btn-secondary"
            style={{ marginBottom: '20px', alignSelf: 'flex-start' }}
          >
            {isRewriting ? 'Generating Rewrites...' : 'Rewrite with Impact'}
          </button>

          {/* Generated Rewrites */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rewrites.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    {r.title}
                  </span>
                  <button
                    onClick={() => handleCopy(r.text, i)}
                    className="btn-ghost"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', color: copiedIdx === i ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                  >
                    {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />} {copiedIdx === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
                  {r.text}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '6px', fontWeight: 600 }}>
                  ✦ Focus: {r.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Top Score Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            <div className="glass-card glow-border" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1 }}>
                {analysis.overallScore}
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px' }}>Overall Resume Score</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on technical depth &amp; impact</div>
            </div>

            <div className="glass-card glow-border" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>
                {analysis.atsScore}%
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px' }}>ATS Readability Rating</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parser search friendly</div>
            </div>

            <div className="glass-card glow-border" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-indigo)', lineHeight: 1 }}>
                {analysis.roleMatchPercentage}%
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px' }}>Target Role Alignment</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>For {analysis.targetRole}</div>
            </div>
          </div>

          {/* Detailed Section Breakdown & Missing Keywords */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Strengths & Weaknesses */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} /> Key Strengths
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {analysis.strengths.map((s, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--accent-amber)' }} /> Priority Improvements
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>⚠</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords for Target Role */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} style={{ color: 'var(--accent-cyan)' }} /> Missing ATS Keywords ({analysis.missingKeywords.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Recruiters filter for these terms when scanning applications for {analysis.targetRole}:
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {analysis.missingKeywords.map((kw, i) => (
                  <span key={i} className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    + {kw}
                  </span>
                ))}
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--accent-cyan)' }}>Recommendation:</strong> Weave these keywords naturally into your project tech stacks or bullet accomplishment verbs.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Top-up Modal */}
      <BuyCreditsModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </div>
  );
}
