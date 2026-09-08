'use client';

import React, { useEffect, useRef } from 'react';

interface GlobeCanvasProps {
  className?: string;
}

export default function GlobeCanvas({ className = '' }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Global tech hub coordinates (Bangalore, Delhi, Mumbai, Hyderabad, Kolkata, Chennai, SF, London, Singapore, Tokyo, Sydney, NY)
    const cities = [
      { lat: 12.97, lon: 77.59 },
      { lat: 28.61, lon: 77.21 },
      { lat: 19.07, lon: 72.87 },
      { lat: 17.38, lon: 78.48 },
      { lat: 22.57, lon: 88.36 },
      { lat: 13.08, lon: 80.27 },
      { lat: 37.77, lon: -122.4 },
      { lat: 51.5, lon: -0.12 },
      { lat: 1.35, lon: 103.8 },
      { lat: 35.68, lon: 139.69 },
      { lat: -33.86, lon: 151.2 },
      { lat: 40.71, lon: -74 },
    ];

    const connections = [
      [0, 6],
      [0, 7],
      [1, 9],
      [2, 8],
      [3, 11],
      [4, 10],
      [5, 8],
      [1, 7],
    ];

    const to3D = (pt: { lat: number; lon: number }, rot: number) => {
      const latRad = (pt.lat * Math.PI) / 180;
      const lonRad = (pt.lon * Math.PI) / 180 + rot;
      return {
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad),
      };
    };

    let rot = 0;
    let pulse = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let autoRotate = true;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      autoRotate = false;
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      rot += dx * 0.006;
    };

    const onPointerUp = () => {
      isDragging = false;
      autoRotate = true;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.style.cursor = 'grab';

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      rot += 0.0032;
      pulse += 0.006;

      const tilt = -0.38;
      const project = (p3: { x: number; y: number; z: number }) => {
        const yTilt = p3.y * Math.cos(tilt) - p3.z * Math.sin(tilt);
        const zTilt = p3.y * Math.sin(tilt) + p3.z * Math.cos(tilt);
        return {
          sx: cx + p3.x * radius,
          sy: cy + yTilt * radius,
          z: zTilt,
        };
      };

      // Outer radial glow
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.5);
      outerGlow.addColorStop(0, 'hsla(196, 95%, 60%, 0.16)');
      outerGlow.addColorStop(1, 'hsla(196, 95%, 60%, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sphere base gradient
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      sphereGrad.addColorStop(0, 'hsla(243, 60%, 26%, 0.55)');
      sphereGrad.addColorStop(1, 'hsla(240, 60%, 6%, 0.85)');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1;

      // Meridians (longitudes)
      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        let drawing = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const pt = project(to3D({ lat, lon: (i * 360) / 14 }, rot));
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

      // Parallels (latitudes)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let drawing = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const pt = project(to3D({ lat, lon }, rot));
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

      // Flight Arcs
      connections.forEach(([fromIdx, toIdx], arcIdx) => {
        const p1 = project(to3D(cities[fromIdx], rot));
        const p2 = project(to3D(cities[toIdx], rot));
        if (p1.z < -0.1 || p2.z < -0.1) return;

        const midX = (p1.sx + p2.sx) / 2;
        const dist = Math.hypot(p2.sx - p1.sx, p2.sy - p1.sy);
        const midY = (p1.sy + p2.sy) / 2 - dist * 0.42;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.quadraticCurveTo(midX, midY, p2.sx, p2.sy);
        ctx.strokeStyle = 'hsla(196, 95%, 65%, 0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling photon packet
        const t = (pulse * 0.6 + arcIdx * 0.17) % 1;
        const invT = 1 - t;
        const packetX = invT * invT * p1.sx + 2 * invT * t * midX + t * t * p2.sx;
        const packetY = invT * invT * p1.sy + 2 * invT * t * midY + t * t * p2.sy;

        const packetGlow = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 7);
        packetGlow.addColorStop(0, 'hsla(255, 90%, 80%, 0.95)');
        packetGlow.addColorStop(1, 'hsla(255, 90%, 80%, 0)');
        ctx.fillStyle = packetGlow;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // City nodes
      cities.forEach((city, cityIdx) => {
        const pt = project(to3D(city, rot));
        if (pt.z < 0) return;

        const ping = 1 + Math.sin(pulse * 2.4 + cityIdx) * 0.35;
        ctx.fillStyle = 'hsla(196, 100%, 72%, 0.95)';
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `hsla(196, 100%, 72%, ${0.28 / ping})`;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 5 * ping, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rim highlight
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
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
