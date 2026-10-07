'use client';

import React from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  Sliders, 
  Sun, 
  Moon, 
  Monitor,
  Type,
  Layout,
  Activity,
  Grid
} from 'lucide-react';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { 
  ThemeMode, 
  TypographyChoice, 
  DensityChoice, 
  MotionChoice, 
  BackgroundChoice,
  TYPOGRAPHY_OPTIONS 
} from '@/lib/theme/themeConfig';

export function ThemeCustomizerModal() {
  const {
    preferences,
    isCustomizerOpen,
    setIsCustomizerOpen,
    setTheme,
    setTypography,
    setDensity,
    setMotion,
    setBackground,
    resetToDefaults,
  } = useThemeCustomizer();

  if (!isCustomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Click outside to close */}
      <div 
        className="flex-1 cursor-pointer" 
        onClick={() => setIsCustomizerOpen(false)} 
      />

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-md h-full bg-[#050505] text-white border-l border-white/10 shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto animate-fadeIn relative">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">
              <Sliders size={14} /> Control System
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
              Customize Your TYGN
            </h2>
          </div>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close Customizer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customization Options */}
        <div className="space-y-8 flex-1">
          {/* 1. Appearance / Theme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3 flex items-center gap-2">
              <Sun size={14} /> Appearance
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#111111] rounded-xl border border-white/10">
              {(
                [
                  { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                  { id: 'light', label: 'Light', icon: <Sun size={14} /> },
                  { id: 'system', label: 'System', icon: <Monitor size={14} /> },
                ] as { id: ThemeMode; label: string; icon: React.ReactNode }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    preferences.theme === opt.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Typography */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3 flex items-center gap-2">
              <Type size={14} /> Typography
            </label>
            <div className="space-y-2">
              {TYPOGRAPHY_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTypography(f.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    preferences.typography === f.id
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-[#111111] border-white/5 text-[#a3a3a3] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">{f.name}</div>
                    <div className="text-xs text-[#737373] mt-0.5">{f.sample}</div>
                  </div>
                  {preferences.typography === f.id && (
                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Density */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3 flex items-center gap-2">
              <Layout size={14} /> Interface Density
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#111111] rounded-xl border border-white/10">
              {(
                [
                  { id: 'compact', label: 'Compact' },
                  { id: 'comfortable', label: 'Comfortable' },
                  { id: 'spacious', label: 'Spacious' },
                ] as { id: DensityChoice; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDensity(opt.id)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    preferences.density === opt.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Motion */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3 flex items-center gap-2">
              <Activity size={14} /> Motion & Animation
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#111111] rounded-xl border border-white/10">
              {(
                [
                  { id: 'full', label: 'Full Motion' },
                  { id: 'reduced', label: 'Reduced Motion' },
                ] as { id: MotionChoice; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMotion(opt.id)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    preferences.motion === opt.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Background */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3 flex items-center gap-2">
              <Grid size={14} /> Background Style
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#111111] rounded-xl border border-white/10">
              {(
                [
                  { id: 'clean', label: 'Clean' },
                  { id: 'grid', label: 'Grid' },
                  { id: 'cinematic', label: 'Cinematic' },
                ] as { id: BackgroundChoice; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBackground(opt.id)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    preferences.background === opt.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="btn btn-primary text-xs py-2 px-5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
