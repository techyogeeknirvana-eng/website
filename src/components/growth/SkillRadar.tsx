'use client';

import React, { useEffect, useState } from 'react';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { UserGrowthProgress } from '@/types/growth';

export function SkillRadar() {
  const [progress, setProgress] = useState<UserGrowthProgress>(growthProgressStore.getProgress());

  useEffect(() => {
    setProgress(growthProgressStore.getProgress());
  }, []);

  const stats = [
    { label: 'Communication', value: progress.radarScores.communication },
    { label: 'Confidence', value: progress.radarScores.confidence },
    { label: 'Etiquette', value: progress.radarScores.etiquette },
    { label: 'Critical Thinking', value: progress.radarScores.criticalThinking },
    { label: 'Tech Knowledge', value: progress.radarScores.technicalKnowledge },
    { label: 'Leadership', value: progress.radarScores.leadership },
    { label: 'Problem Solving', value: progress.radarScores.problemSolving },
    { label: 'Presentation', value: progress.radarScores.presentation }
  ];

  const size = 320;
  const center = size / 2;
  const radius = 110;
  const total = stats.length;

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (index * (2 * Math.PI)) / total - Math.PI / 2;
    const r = (valPercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points
  const points = stats.map((s, i) => {
    const { x, y } = getCoordinates(i, s.value);
    return `${x},${y}`;
  }).join(' ');

  // Grid concentric rings (25%, 50%, 75%, 100%)
  const gridRings = [25, 50, 75, 100];

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <h4 className="font-bold text-sm text-white">TYGN Skill Radar</h4>
        <span className="text-[11px] font-mono text-cyan-400">Adaptive Matrix</span>
      </div>

      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Concentric Grid Polygons */}
          {gridRings.map(pct => {
            const ringPoints = stats.map((_, i) => {
              const { x, y } = getCoordinates(i, pct);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={pct}
                points={ringPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Axis Lines */}
          {stats.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={points}
            fill="rgba(0, 229, 255, 0.22)"
            stroke="#00e5ff"
            strokeWidth="2.5"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.4))'
            }}
          />

          {/* Data Points */}
          {stats.map((s, i) => {
            const { x, y } = getCoordinates(i, s.value);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Outer Labels */}
          {stats.map((s, i) => {
            const { x, y } = getCoordinates(i, 122);
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none font-sans"
              >
                {s.label} ({s.value})
              </text>
            );
          })}
        </svg>
      </div>

      <p className="text-[11px] text-slate-400 mt-4 text-center">
        Scores dynamically calibrate as you complete quizzes, daily challenges, and games.
      </p>
    </div>
  );
}
