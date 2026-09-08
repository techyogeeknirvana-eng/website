'use client';

import React, { useEffect, useRef } from 'react';

interface GlobalMeshCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GlobalMeshCanvas({ className = '', style }: GlobalMeshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 440;
      height = rect.height || 440;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Global city coordinates (India hub + Global tech hubs)
    const cities = [
      { lat: 12.97, lon: 77.59, name: 'Bengaluru' },
      { lat: 28.61, lon: 77.21, name: 'New Delhi' },
      { lat: 19.07, lon: 72.87, name: 'Mumbai' },
      { lat: 17.38, lon: 78.48, name: 'Hyderabad' },
      { lat: 22.57, lon: 88.36, name: 'Kolkata' },
      { lat: 13.08, lon: 80.27, name: 'Chennai' },
      { lat: 37.77, lon: -122.4, name: 'San Francisco' },
      { lat: 51.5, lon: -0.12, name: 'London' },
      { lat: 1.35, lon: 103.8, name: 'Singapore' },
      { lat: 35.68, lon: 139.69, name: 'Tokyo' },
      { lat: -33.86, lon: 151.2, name: 'Sydney' },
      { lat: 40.71, lon: -74, name: 'New York' },
    ];

    const connections = [
      [0, 6], [0, 7], [1, 9], [2, 8], [3, 11], [4, 10], [5, 8], [1, 7],
    ];

    const projectToSphere = (pos: { lat: number; lon: number }, rot: number) => {
      const phi = (pos.lat * Math.PI) / 180;
      const lambda = (pos.lon * Math.PI) / 180 + rot;
      return {
        x: Math.cos(phi) * Math.sin(lambda),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.cos(lambda),
      };
    };

    let rot = 0;
    let packetTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      rot += 0.0032;
      packetTimer += 0.006;
      const tilt = -0.38;

      const toScreen = (v: { x: number; y: number; z: number }) => {
        const yRot = v.y * Math.cos(tilt) - v.z * Math.sin(tilt);
        const zRot = v.y * Math.sin(tilt) + v.z * Math.cos(tilt);
        return {
          sx: cx + v.x * radius,
          sy: cy + yRot * radius,
          z: zRot,
        };
      };

      // Outer Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.5);
      glowGrad.addColorStop(0, 'hsla(196, 95%, 60%, 0.16)');
      glowGrad.addColorStop(1, 'hsla(196, 95%, 60%, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sphere Body
      const bodyGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      bodyGrad.addColorStop(0, 'hsla(243, 60%, 26%, 0.55)');
      bodyGrad.addColorStop(1, 'hsla(240, 60%, 6%, 0.85)');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1;

      // Meridians (Longitude lines)
      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        let drawing = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const pt = toScreen(projectToSphere({ lat, lon: (i * 360) / 14 }, rot));
          if (pt.z < -0.02) {
            drawing = false;
            continue;
          }
          if (drawing) {
            ctx.lineTo(pt.sx, pt.sy);
          } else {
            ctx.moveTo(pt.sx, pt.sy);
            drawing = true;
          }
        }
        ctx.strokeStyle = 'hsla(196, 95%, 62%, 0.16)';
        ctx.stroke();
      }

      // Parallels (Latitude lines)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let drawing = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const pt = toScreen(projectToSphere({ lat, lon }, rot));
          if (pt.z < -0.02) {
            drawing = false;
            continue;
          }
          if (drawing) {
            ctx.lineTo(pt.sx, pt.sy);
          } else {
            ctx.moveTo(pt.sx, pt.sy);
            drawing = true;
          }
        }
        ctx.strokeStyle = 'hsla(255, 85%, 72%, 0.14)';
        ctx.stroke();
      }

      // Arcs and moving data packets
      connections.forEach(([fromIdx, toIdx], idx) => {
        const p1 = toScreen(projectToSphere(cities[fromIdx], rot));
        const p2 = toScreen(projectToSphere(cities[toIdx], rot));
        if (p1.z < -0.1 || p2.z < -0.1) return;

        const midX = (p1.sx + p2.sx) / 2;
        const midY = (p1.sy + p2.sy) / 2 - Math.hypot(p2.sx - p1.sx, p2.sy - p1.sy) * 0.42;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.quadraticCurveTo(midX, midY, p2.sx, p2.sy);
        ctx.strokeStyle = 'hsla(196, 95%, 65%, 0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated data packets along curve
        const t = (packetTimer * 0.6 + idx * 0.17) % 1;
        const invT = 1 - t;
        const px = invT * invT * p1.sx + 2 * invT * t * midX + t * t * p2.sx;
        const py = invT * invT * p1.sy + 2 * invT * t * midY + t * t * p2.sy;

        const packetGrad = ctx.createRadialGradient(px, py, 0, px, py, 7);
        packetGrad.addColorStop(0, 'hsla(255, 90%, 80%, 0.95)');
        packetGrad.addColorStop(1, 'hsla(255, 90%, 80%, 0)');
        ctx.fillStyle = packetGrad;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // City Nodes
      cities.forEach((city, idx) => {
        const pt = toScreen(projectToSphere(city, rot));
        if (pt.z < 0) return;

        const pulse = 1 + Math.sin(packetTimer * 2.4 + idx) * 0.35;
        ctx.fillStyle = 'hsla(196, 100%, 72%, 0.95)';
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `hsla(196, 100%, 72%, ${0.28 / pulse})`;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 5 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Outer Ring
      ctx.strokeStyle = 'hsla(196, 95%, 66%, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

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
