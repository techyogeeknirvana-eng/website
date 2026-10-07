'use client';

import React, { useEffect, useState } from 'react';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { UserGrowthProgress } from '@/types/growth';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function SkillRadar() {
  const { isDark } = useThemeCustomizer();
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
  const radius = 100;
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

  const gridRings = [25, 50, 75, 100];

  return (
    <div className="mono-card p-6 w-full max-w-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3 text-inherit">
        <h4 className="font-display font-bold text-sm">Competency Matrix</h4>
        <span className="text-[10px] font-mono uppercase text-[#737373]">Verified Radar</span>
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Concentric Rings */}
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
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth="1"
                strokeDasharray={pct === 100 ? undefined : '2,2'}
              />
            );
          })}

          {/* Spokes */}
          {stats.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth="1"
              />
            );
          })}

          {/* User Score Polygon (Strict Monochrome Fill & Stroke) */}
          <polygon
            points={points}
            fill={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}
            stroke={isDark ? '#ffffff' : '#000000'}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Vertex Dots & Value Labels */}
          {stats.map((s, i) => {
            const { x, y } = getCoordinates(i, s.value);
            const outerCoord = getCoordinates(i, 118);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill={isDark ? '#ffffff' : '#000000'}
                />
                <text
                  x={outerCoord.x}
                  y={outerCoord.y}
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isDark ? '#a3a3a3' : '#525252'}
                  fontFamily="var(--font-sans)"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
