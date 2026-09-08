'use client';

import React, { useEffect, useRef } from 'react';

interface CyberHackerCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CyberHackerCanvas({ className = '', style }: CyberHackerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    let animId = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 360;
      height = rect.height || 360;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Vector paths for holographic skull
    const cranialOutline = new Path2D('M100 8 C46 8 18 46 18 92 C18 118 28 134 40 146 C48 154 50 162 50 172 C50 186 60 194 74 194 L126 194 C140 194 150 186 150 172 C150 162 152 154 160 146 C172 134 182 118 182 92 C182 46 154 8 100 8 Z');
    const leftEye = new Path2D('M68 96 m-24 0 a24 22 0 1 0 48 0 a24 22 0 1 0 -48 0');
    const rightEye = new Path2D('M132 96 m-24 0 a24 22 0 1 0 48 0 a24 22 0 1 0 -48 0');
    const nose = new Path2D('M100 122 L88 150 L100 156 L112 150 Z');
    const teeth = new Path2D('M62 168 L138 168 M62 168 L62 190 M138 168 L138 190 M86 168 L86 192 M100 168 L100 192 M114 168 L114 192');
    const cheeks = new Path2D('M34 118 C52 132 62 140 66 152 M166 118 C148 132 138 140 134 152');

    const particles = Array.from({ length: 46 }, (_, i) => ({
      a: (i / 46) * Math.PI * 2,
      r: 96 + (i % 5) * 9,
      s: 0.2 + (i % 7) * 0.05,
    }));

    const drawPaths = (alpha: number, strokeStyle: string, lineWidth: number) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = alpha;
      ctx.stroke(cranialOutline);
      ctx.stroke(leftEye);
      ctx.stroke(rightEye);
      ctx.stroke(nose);
      ctx.stroke(teeth);
      ctx.stroke(cheeks);
      ctx.globalAlpha = 1;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      const scale = Math.min(width / 200, height / 220) * 0.82;
      const bob = Math.sin(time * 0.9) * 4;

      ctx.save();
      ctx.translate(width / 2, height / 2 + bob);
      ctx.scale(scale, scale);
      ctx.translate(-100, -110);

      // Eye Glows
      const leftGlow = ctx.createRadialGradient(68, 96, 2, 68, 96, 40);
      leftGlow.addColorStop(0, `hsla(196, 100%, 68%, ${0.5 + Math.sin(time * 3) * 0.18})`);
      leftGlow.addColorStop(1, 'hsla(196, 100%, 68%, 0)');
      ctx.fillStyle = leftGlow;
      ctx.fill(leftEye);

      const rightGlow = ctx.createRadialGradient(132, 96, 2, 132, 96, 40);
      rightGlow.addColorStop(0, `hsla(255, 95%, 76%, ${0.5 + Math.cos(time * 3) * 0.18})`);
      rightGlow.addColorStop(1, 'hsla(255, 95%, 76%, 0)');
      ctx.fillStyle = rightGlow;
      ctx.fill(rightEye);

      // Chromatic Aberration Layers
      const glitchOffset = Math.sin(time * 7) > 0.94 ? 3.2 : 0.8;

      ctx.save();
      ctx.translate(-glitchOffset, 0);
      drawPaths(0.5, 'hsla(255, 95%, 72%, 1)', 1.6);
      ctx.restore();

      ctx.save();
      ctx.translate(glitchOffset, 0);
      drawPaths(0.5, 'hsla(196, 100%, 66%, 1)', 1.6);
      ctx.restore();

      // Sharp Core Layer
      drawPaths(0.95, 'hsla(210, 40%, 92%, 0.9)', 1.1);

      // Orbital Matrix Particles
      particles.forEach((p, idx) => {
        const angle = p.a + time * p.s;
        const px = 100 + Math.cos(angle) * p.r;
        const py = 110 + Math.sin(angle) * p.r * 0.6;
        ctx.fillStyle = idx % 3 === 0 ? 'hsla(255, 95%, 78%, 0.75)' : 'hsla(196, 100%, 72%, 0.65)';
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scanning Laser Sweep
      const sweepY = (time * 60) % 260 - 20;
      const sweepGrad = ctx.createLinearGradient(0, sweepY - 14, 0, sweepY + 14);
      sweepGrad.addColorStop(0, 'hsla(196, 100%, 70%, 0)');
      sweepGrad.addColorStop(0.5, 'hsla(196, 100%, 70%, 0.30)');
      sweepGrad.addColorStop(1, 'hsla(196, 100%, 70%, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, sweepY - 14, 200, 28);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
