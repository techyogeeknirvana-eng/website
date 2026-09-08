'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, ExternalLink, Shield, Cloud, Cpu, Network, Terminal } from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';

interface FounderCyberProfileProps {
  founder: {
    name: string;
    role: string;
    image: string;
    bio: string;
    detailedBio: string;
    focusAreas: string[];
    linkedinUrl?: string;
  };
}

export default function FounderCyberProfile({ founder }: FounderCyberProfileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport entrance state (triggers once)
  const [inView, setInView] = useState(false);

  // Mouse spotlight coordinates relative to card
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Hover state for card lift & glow
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Track hovered tag for micro-interaction
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  // IntersectionObserver for staggered scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // AI Particle Neural Network Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate lightweight digital nodes
    const nodeCount = Math.min(38, Math.floor((width * height) / 22000));
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0) node.x = width;
          else if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          else if (node.y > height) node.y = 0;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fill();

        // Connect nearby nodes with ultra-thin line
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const alpha = (1 - dist / 95) * 0.12;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mouse move handler for card spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
    setIsCardHovered(false);
  };

  // Helper icons for tech tags
  const getTagIcon = (area: string) => {
    const lower = area.toLowerCase();
    if (lower.includes('cyber')) return <Shield size={12} style={{ color: 'var(--accent-cyan)' }} />;
    if (lower.includes('cloud')) return <Cloud size={12} style={{ color: '#38bdf8' }} />;
    if (lower.includes('ai') || lower.includes('intelligence')) return <Cpu size={12} style={{ color: 'var(--accent-purple)' }} />;
    if (lower.includes('network')) return <Network size={12} style={{ color: '#10b981' }} />;
    return <Terminal size={12} style={{ color: 'var(--accent-indigo)' }} />;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        maxWidth: '960px',
        margin: '0 auto 60px auto',
      }}
    >
      {/* Component-Scoped Futuristic Keyframes */}
      <style>{`
        @keyframes cyberRingRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cyberAvatarPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.35));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 0 28px rgba(168, 85, 247, 0.5));
          }
        }
        @keyframes cyberBorderGlowShift {
          0% {
            border-color: rgba(6, 182, 212, 0.35);
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.12), 0 25px 60px rgba(0, 0, 0, 0.5);
          }
          50% {
            border-color: rgba(168, 85, 247, 0.4);
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.18), 0 25px 60px rgba(0, 0, 0, 0.5);
          }
          100% {
            border-color: rgba(6, 182, 212, 0.35);
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.12), 0 25px 60px rgba(0, 0, 0, 0.5);
          }
        }
        @keyframes cyberScanlineHoriz {
          0% {
            top: -5%;
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            top: 105%;
            opacity: 0;
          }
        }
        @keyframes cyberFaintDataBreathe {
          0%, 100% { opacity: 0.035; }
          50% { opacity: 0.075; }
        }

        .cyber-profile-card {
          animation: cyberBorderGlowShift 8s ease-in-out infinite;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease,
                      box-shadow 0.4s ease;
        }

        .cyber-profile-card-hovered {
          transform: translateY(-6px) !important;
          border-color: rgba(56, 189, 248, 0.65) !important;
          box-shadow: 0 0 50px rgba(6, 182, 212, 0.3), 0 30px 70px rgba(0, 0, 0, 0.6) !important;
        }

        .cyber-scanner-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.75) 50%, transparent 100%);
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
          animation: cyberScanlineHoriz 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 10;
        }

        .cyber-tag-chip {
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease,
                      border-color 0.22s ease,
                      background 0.22s ease;
        }
        .cyber-tag-chip:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 189, 248, 0.6) !important;
          background: rgba(6, 182, 212, 0.14) !important;
          box-shadow: 0 4px 16px rgba(6, 182, 212, 0.35) !important;
        }

        .cyber-connect-btn {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.25s ease,
                      filter 0.25s ease;
        }
        .cyber-connect-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(2, 132, 199, 0.65) !important;
          filter: brightness(1.08);
        }
      `}</style>

      {/* 3. AI PARTICLES: Background Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: '-20px',
          width: 'calc(100% + 40px)',
          height: 'calc(100% + 40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 6. AI DATA EFFECT: Faint Abstract Technical Telemetry Layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          fontFamily: 'monospace',
          fontSize: '0.74rem',
          color: 'rgba(56, 189, 248, 0.5)',
          animation: 'cyberFaintDataBreathe 6s ease-in-out infinite',
          userSelect: 'none',
        }}
      >
        <div style={{ position: 'absolute', top: '14px', left: '24px', letterSpacing: '0.12em' }}>
          0101 // SYS_READY
        </div>
        <div style={{ position: 'absolute', top: '14px', right: '32px', letterSpacing: '0.12em' }}>
          AI_CORE_ACTIVE // 01
        </div>
        <div style={{ position: 'absolute', bottom: '16px', left: '36px', letterSpacing: '0.12em' }}>
          NET // INFRASTRUCTURE
        </div>
        <div style={{ position: 'absolute', bottom: '16px', right: '40px', letterSpacing: '0.12em' }}>
          CYBER // 10
        </div>
      </div>

      {/* 2. PROFILE CARD: Sophisticated Glass Surface with Animated Border Gradient */}
      <div
        ref={cardRef}
        className={`glass-card cyber-profile-card ${isCardHovered ? 'cyber-profile-card-hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '42px 38px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, rgba(13, 18, 36, 0.85) 0%, rgba(6, 9, 20, 0.94) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '38px',
          alignItems: 'center',
        }}
      >
        {/* 4. SCANNING EFFECT: Subtle Periodic Laser Scanline */}
        <div className="cyber-scanner-line" />

        {/* 7. CURSOR INTERACTION: Dynamic Mouse-Follow Spotlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: mousePos.active ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.16) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 75%)`,
          }}
        />

        {/* Subtle Cyber Corner Reticle Accents */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', width: '8px', height: '8px', borderTop: '2px solid rgba(6, 182, 212, 0.5)', borderLeft: '2px solid rgba(6, 182, 212, 0.5)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderTop: '2px solid rgba(6, 182, 212, 0.5)', borderRight: '2px solid rgba(6, 182, 212, 0.5)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '8px', height: '8px', borderBottom: '2px solid rgba(6, 182, 212, 0.5)', borderLeft: '2px solid rgba(6, 182, 212, 0.5)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '8px', height: '8px', borderBottom: '2px solid rgba(6, 182, 212, 0.5)', borderRight: '2px solid rgba(6, 182, 212, 0.5)', pointerEvents: 'none' }} />

        {/* ==========================================================
            LEFT COLUMN: PROFILE IMAGE & IDENTITY
        ========================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* 1. PROFILE IMAGE: Circular Holographic Frame */}
          <div
            style={{
              position: 'relative',
              width: '190px',
              height: '190px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.92)',
              transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '0.05s',
            }}
          >
            {/* Subtle Animated Cyan Glow Behind Image */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(99, 102, 241, 0.12) 60%, transparent 80%)',
                animation: 'cyberAvatarPulse 4s ease-in-out infinite',
              }}
            />

            {/* Thin Circular Scanning Ring that slowly rotates */}
            <div
              style={{
                position: 'absolute',
                inset: '0px',
                borderRadius: '50%',
                border: '1px dashed rgba(6, 182, 212, 0.5)',
                animation: 'cyberRingRotate 18s linear infinite',
              }}
            >
              {/* Micro Scanning Radar Pip 1 */}
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 8px var(--accent-cyan)',
                }}
              />
              {/* Micro Scanning Radar Pip 2 */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  boxShadow: '0 0 8px var(--accent-purple)',
                }}
              />
            </div>

            {/* Inner Gradient Border Ring */}
            <div
              style={{
                position: 'relative',
                width: '168px',
                height: '168px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#07090e',
                  position: 'relative',
                }}
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: isCardHovered ? 'scale(1.04)' : 'scale(1)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* NAME */}
          <h3
            style={{
              fontSize: '1.55rem',
              fontWeight: 900,
              marginBottom: '6px',
              letterSpacing: '-0.015em',
              color: '#ffffff',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.18s',
            }}
          >
            {founder.name}
          </h3>

          {/* ROLE: FOUNDER & TECHNOLOGY ENTHUSIAST */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.30s',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: 'var(--accent-cyan)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <Zap size={13} fill="currentColor" /> {founder.role}
            </span>
          </div>
        </div>

        {/* ==========================================================
            RIGHT COLUMN: BIO, TECH TAGS & LINKEDIN
        ========================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* BIO PARAGRAPHS */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.42s',
            }}
          >
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
                lineHeight: 1.65,
                marginBottom: '14px',
                fontWeight: 500,
              }}
            >
              {founder.bio}
            </p>

            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '22px',
              }}
            >
              {founder.detailedBio}
            </p>
          </div>

          {/* 5. TECH TAGS: KEY TECHNICAL INTERESTS & FOCUS */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.52s',
            }}
          >
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }} />
              KEY TECHNICAL INTERESTS &amp; FOCUS
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {founder.focusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="cyber-tag-chip"
                  onMouseEnter={() => {
                    setHoveredTag(idx);
                    soundEffects.playClick();
                  }}
                  onMouseLeave={() => setHoveredTag(null)}
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: hoveredTag === idx ? 'rgba(6, 182, 212, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                    border: hoveredTag === idx ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: hoveredTag === idx ? '#ffffff' : '#e2e8f0',
                    cursor: 'default',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${0.55 + idx * 0.06}s`,
                  }}
                >
                  {getTagIcon(area)}
                  <span>{area}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 8. LINKEDIN BUTTON: CONNECT ON LINKEDIN */}
          <div
            style={{
              marginTop: '24px',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.72s',
            }}
          >
            <a
              href="https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary cyber-connect-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
                color: '#ffffff',
              }}
            >
              <LinkedinIcon size={18} color="#ffffff" />
              <span>CONNECT ON LINKEDIN</span>
              <ExternalLink size={14} style={{ opacity: 0.8, marginLeft: '2px' }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
