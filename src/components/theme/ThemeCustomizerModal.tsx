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
  Grid,
  Palette,
  Terminal,
  Sparkles,
  Zap
} from 'lucide-react';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { 
  ThemeMode, 
  TypographyChoice, 
  DensityChoice, 
  MotionChoice, 
  BackgroundChoice,
  TYPOGRAPHY_OPTIONS,
  FONT_COLOR_PRESETS
} from '@/lib/theme/themeConfig';
import { soundEffects } from '@/lib/audio/soundEffects';

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
    setFontColor,
    setDevMode,
    toggleDevMode,
    resetToDefaults,
    isDark,
  } = useThemeCustomizer();

  if (!isCustomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Click outside to close */}
      <div 
        className="flex-1 cursor-pointer" 
        onClick={() => setIsCustomizerOpen(false)} 
      />

      {/* Slide-over Drawer Panel */}
      <div 
        className="w-full max-w-md h-full shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto animate-fadeIn relative border-l transition-colors"
        style={{
          background: isDark ? '#050505' : '#ffffff',
          color: isDark ? '#ffffff' : '#050505',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Drawer Header */}
        <div 
          className="flex items-center justify-between pb-5 border-b mb-6"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <div>
            <div 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              <Sliders size={14} /> Control System
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight mt-1 text-inherit">
              Interface Settings
            </h2>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsCustomizerOpen(false);
            }}
            className="p-2 rounded-full transition-colors"
            style={{
              color: isDark ? '#a3a3a3' : '#71717a',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            }}
            title="Close Customizer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customization Options */}
        <div className="space-y-7 flex-1">
          {/* 1. Appearance / Theme */}
          <div>
            <label 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              <Sun size={14} /> Theme Mode
            </label>
            <div 
              className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border"
              style={{
                background: isDark ? '#111111' : '#f4f4f5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              {(
                [
                  { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                  { id: 'light', label: 'Light', icon: <Sun size={14} /> },
                  { id: 'system', label: 'System', icon: <Monitor size={14} /> },
                ] as { id: ThemeMode; label: string; icon: React.ReactNode }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setTheme(opt.id);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    preferences.theme === opt.id
                      ? isDark 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-black text-white shadow-md'
                      : isDark
                        ? 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                        : 'text-[#52525b] hover:text-black hover:bg-black/5'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Font Color Customizer (Requested by User) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label 
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
              >
                <Palette size={14} /> Font &amp; Headline Color
              </label>
              <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded border"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  color: isDark ? '#d4d4d4' : '#52525b'
                }}
              >
                {preferences.fontColor === 'default' ? 'Monochrome' : preferences.fontColor}
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {FONT_COLOR_PRESETS.map((p) => {
                const isSelected = (preferences.fontColor || 'default') === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setFontColor(p.id);
                    }}
                    className="p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center"
                    style={{
                      background: isSelected 
                        ? (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
                        : (isDark ? '#111111' : '#f4f4f5'),
                      borderColor: isSelected
                        ? (p.color || (isDark ? '#ffffff' : '#000000'))
                        : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'),
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    }}
                    title={p.name}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border shadow-sm flex items-center justify-center"
                      style={{
                        background: p.color || (isDark ? '#ffffff' : '#000000'),
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {isSelected && (
                        <Check size={11} strokeWidth={3} className={p.id === 'default' && isDark ? 'text-black' : 'text-white'} />
                      )}
                    </div>
                    <span 
                      className="text-[0.62rem] font-medium leading-tight truncate w-full"
                      style={{ color: isDark ? '#d4d4d4' : '#3f3f46' }}
                    >
                      {p.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div 
              className="mt-2.5 p-2.5 rounded-xl border flex items-center justify-between"
              style={{
                background: isDark ? '#111111' : '#f4f4f5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={preferences.fontColor && preferences.fontColor.startsWith('#') ? preferences.fontColor : '#06b6d4'}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-semibold" style={{ color: isDark ? '#d4d4d4' : '#3f3f46' }}>
                  Custom Hex Color:
                </span>
              </div>
              <input 
                type="text"
                placeholder="#06b6d4"
                value={preferences.fontColor || ''}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono rounded border text-center uppercase"
                style={{
                  background: isDark ? '#050505' : '#ffffff',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  color: isDark ? '#ffffff' : '#050505',
                }}
              />
            </div>
          </div>

          {/* 3. Dev Mode (Requested by User) */}
          <div 
            className="p-4 rounded-2xl border transition-all"
            style={{
              background: preferences.devMode 
                ? (isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)')
                : (isDark ? '#111111' : '#f4f4f5'),
              borderColor: preferences.devMode
                ? 'rgba(16, 185, 129, 0.4)'
                : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal size={16} className={preferences.devMode ? 'text-emerald-400' : (isDark ? 'text-white/70' : 'text-black/70')} />
                <span className="text-xs font-bold uppercase tracking-wider text-inherit">
                  Developer Mode (Dev Mode)
                </span>
                <span 
                  className={`text-[0.62rem] font-mono px-2 py-0.5 rounded-full font-bold ${
                    preferences.devMode 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : (isDark ? 'bg-white/10 text-white/50' : 'bg-black/10 text-black/50')
                  }`}
                >
                  {preferences.devMode ? 'ACTIVE' : 'OFF'}
                </span>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => {
                  soundEffects.playClick();
                  toggleDevMode();
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  preferences.devMode ? 'bg-emerald-500 justify-end' : (isDark ? 'bg-white/20 justify-start' : 'bg-black/20 justify-start')
                }`}
                title="Toggle Developer Mode"
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
            <p 
              className="text-xs leading-relaxed"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              Enables live floating diagnostics dock, real-time FPS counter, component outlines, viewport breakpoint tracker, and fast role switcher.
            </p>
          </div>

          {/* 4. Typography Choice */}
          <div>
            <label 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              <Type size={14} /> Font Family
            </label>
            <div className="space-y-2">
              {TYPOGRAPHY_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setTypography(f.id);
                  }}
                  className="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between"
                  style={{
                    background: preferences.typography === f.id
                      ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')
                      : (isDark ? '#111111' : '#f4f4f5'),
                    borderColor: preferences.typography === f.id
                      ? (isDark ? '#ffffff' : '#000000')
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'),
                  }}
                >
                  <div>
                    <div className="text-sm font-bold text-inherit">{f.name}</div>
                    <div 
                      className="text-xs mt-0.5"
                      style={{ color: isDark ? '#737373' : '#71717a' }}
                    >
                      {f.sample}
                    </div>
                  </div>
                  {preferences.typography === f.id && (
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isDark ? '#ffffff' : '#000000',
                        color: isDark ? '#000000' : '#ffffff',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Density */}
          <div>
            <label 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              <Layout size={14} /> Interface Density
            </label>
            <div 
              className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border"
              style={{
                background: isDark ? '#111111' : '#f4f4f5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              {(
                [
                  { id: 'compact', label: 'Compact' },
                  { id: 'comfortable', label: 'Comfortable' },
                  { id: 'spacious', label: 'Spacious' },
                ] as { id: DensityChoice; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setDensity(opt.id);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    preferences.density === opt.id
                      ? isDark 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-black text-white shadow-md'
                      : isDark
                        ? 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                        : 'text-[#52525b] hover:text-black hover:bg-black/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Motion */}
          <div>
            <label 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
              style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
            >
              <Activity size={14} /> Motion &amp; Animation
            </label>
            <div 
              className="grid grid-cols-2 gap-2 p-1.5 rounded-xl border"
              style={{
                background: isDark ? '#111111' : '#f4f4f5',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              {(
                [
                  { id: 'full', label: 'Full Motion' },
                  { id: 'reduced', label: 'Reduced Motion' },
                ] as { id: MotionChoice; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setMotion(opt.id);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    preferences.motion === opt.id
                      ? isDark 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-black text-white shadow-md'
                      : isDark
                        ? 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                        : 'text-[#52525b] hover:text-black hover:bg-black/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div 
          className="pt-5 border-t mt-6 flex items-center justify-between"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <button
            onClick={() => {
              soundEffects.playClick();
              resetToDefaults();
            }}
            className="flex items-center gap-2 text-xs font-semibold transition-colors"
            style={{ color: isDark ? '#a3a3a3' : '#71717a' }}
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsCustomizerOpen(false);
            }}
            className="btn btn-primary text-xs py-2 px-6"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
