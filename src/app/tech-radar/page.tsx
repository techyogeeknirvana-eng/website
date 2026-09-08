'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { TechRadarItem } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function TechRadarPage() {
  const radarItems = dbStore.getTechRadar();
  const [selectedItem, setSelectedItem] = useState<TechRadarItem>(radarItems[0]);
  const [activeQuadrant, setActiveQuadrant] = useState<string>('all');

  const rings = [
    { id: 'adopt', name: 'ADOPT', desc: 'Proven in production; industry standard.' },
    { id: 'trial', name: 'TRIAL', desc: 'High potential; pilot in upcoming projects.' },
    { id: 'assess', name: 'ASSESS', desc: 'Promising technology worth exploring.' },
    { id: 'hold', name: 'HOLD', desc: 'Proceed with caution or sunset in new systems.' },
  ];

  const quadrants = [
    { id: 'all', name: 'All Domains' },
    { id: 'ai', name: 'Artificial Intelligence' },
    { id: 'web', name: 'Web & Systems' },
    { id: 'cloud', name: 'Cloud & DevOps' },
    { id: 'security', name: 'Cybersecurity' },
  ];

  const filteredItems = activeQuadrant === 'all'
    ? radarItems
    : radarItems.filter(item => item.quadrant === activeQuadrant);

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
          Interactive Tech Radar 2026
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Technology &amp; Engineering Radar
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '750px' }}>
          Curated insight into modern software tools, frameworks, and architectures across AI, Web, Cloud, and Security quadrants.
        </p>
      </div>

      {/* Domain Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {quadrants.map(q => (
          <button
            key={q.id}
            onClick={() => {
              soundEffects.playClick();
              setActiveQuadrant(q.id);
            }}
            className="btn-ghost"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: activeQuadrant === q.id ? 700 : 500,
              background: activeQuadrant === q.id ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.05)',
              color: activeQuadrant === q.id ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            {q.name}
          </button>
        ))}
      </div>

      {/* Radar Visual Rings Grid + Item Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        {/* Radar Rings Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {rings.map(ring => {
            const itemsInRing = filteredItems.filter(i => i.ring === ring.id);

            return (
              <div
                key={ring.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderLeft: `4px solid ${ring.id === 'adopt' ? '#10b981' : ring.id === 'trial' ? '#06b6d4' : ring.id === 'assess' ? '#f59e0b' : '#f43f5e'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {ring.name}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {itemsInRing.length} technologies
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {ring.desc}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {itemsInRing.map(item => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundEffects.playClick();
                          setSelectedItem(item);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: isSelected ? 'var(--gradient-nirvana)' : 'rgba(255, 255, 255, 0.06)',
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                          boxShadow: isSelected ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
                        }}
                      >
                        <span>{item.name}</span>
                        <span style={{ fontSize: '0.7rem', color: isSelected ? '#fff' : 'var(--accent-emerald)', fontWeight: 700 }}>
                          {item.trend}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Technology Inspector Drawer */}
        {selectedItem && (
          <div
            className="glass-card glow-border"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-xl)',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className={`badge ${selectedItem.ring === 'adopt' ? 'badge-emerald' : selectedItem.ring === 'trial' ? 'badge-cyan' : 'badge-amber'}`} style={{ marginBottom: '8px' }}>
                  RING: {selectedItem.ring.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedItem.name}</h2>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.8rem' }}>
                <TrendingUp size={12} /> {selectedItem.trend} Demand
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedItem.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Market Demand</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{selectedItem.demand}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Difficulty Curve</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{selectedItem.difficulty}</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Related Technologies</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedItem.related.map((r, i) => (
                  <span key={i} className="badge" style={{ fontSize: '0.78rem' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Recommended Learning Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedItem.keyResources.map((res, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ExternalLink size={13} /> {res}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/roadmaps"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
            >
              Explore Full Career Roadmap <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
