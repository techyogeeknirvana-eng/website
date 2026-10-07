'use client';

import React from 'react';
import { 
  X, 
  Palette, 
  Type, 
  Sliders, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { THEME_PRESETS, FONT_PRESETS } from '@/lib/theme/themeConfig';

export function ThemeCustomizerModal() {
  const {
    activeTheme,
    activeFont,
    customColors,
    glassIntensity,
    gradientIntensity,
    isCustomizerOpen,
    setIsCustomizerOpen,
    setTheme,
    setFont,
    setCustomColor,
    setGlassIntensity,
    setGradientIntensity,
    resetToDefaults
  } = useThemeCustomizer();

  if (!isCustomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Click outside to close */}
      <div 
        className="flex-1" 
        onClick={() => setIsCustomizerOpen(false)}
      />

      {/* Drawer Panel */}
      <div 
        className="w-full max-w-md h-full overflow-y-auto bg-[#070a14] border-l border-white/10 shadow-2xl p-6 text-slate-100 flex flex-col justify-between"
        style={{
          background: 'linear-gradient(180deg, #090e1c 0%, #05070f 100%)'
        }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Palette size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Customize Experience</h3>
                <p className="text-xs text-slate-400">Themes, typography & live cyber styling</p>
              </div>
            </div>
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Customizer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Section 1: 10 Theme Presets */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-cyan-400" /> Theme Presets (10)
              </span>
              <span className="text-xs text-cyan-400 font-medium">{activeTheme.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {THEME_PRESETS.map(preset => {
                const isSelected = activeTheme.id === preset.id && !customColors.background;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTheme(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-cyan-400/80 bg-white/10 shadow-lg shadow-cyan-500/10'
                        : 'border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-white">{preset.name}</span>
                      <div className="flex items-center gap-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: preset.accentPrimary }} 
                        />
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: preset.accentSecondary }} 
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{preset.tagline}</p>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Typography Pairings */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Type size={14} className="text-indigo-400" /> Font Pairings
              </span>
              <span className="text-xs text-indigo-400 font-medium">{activeFont.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {FONT_PRESETS.map(font => {
                const isSelected = activeFont.id === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => setFont(font.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-400/80 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                        : 'border-white/5 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white mb-0.5">{font.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{font.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Fine-Tuning Sliders */}
          <div className="mb-7 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Sliders size={14} className="text-amber-400" /> Surface &amp; Glow Controls
            </div>

            {/* Glass Intensity */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Card Glass Intensity</span>
                <span className="font-mono text-cyan-400">{Math.round(glassIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={glassIntensity}
                onChange={e => setGlassIntensity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Gradient Glow Intensity */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Gradient Glow Power</span>
                <span className="font-mono text-indigo-400">{Math.round(gradientIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={gradientIntensity}
                onChange={e => setGradientIntensity(parseFloat(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Granular Custom Color Pickers */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers size={14} className="text-rose-400" /> Custom Color Overrides
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Primary</span>
                <input
                  type="color"
                  value={customColors.primary || activeTheme.accentPrimary}
                  onChange={e => setCustomColor('primary', e.target.value)}
                  className="w-8 h-8 rounded-full border border-white/20 bg-transparent cursor-pointer mx-auto block"
                />
              </div>
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Accent</span>
                <input
                  type="color"
                  value={customColors.accent || activeTheme.accentSecondary}
                  onChange={e => setCustomColor('accent', e.target.value)}
                  className="w-8 h-8 rounded-full border border-white/20 bg-transparent cursor-pointer mx-auto block"
                />
              </div>
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Background</span>
                <input
                  type="color"
                  value={customColors.background || activeTheme.bgPrimary}
                  onChange={e => setCustomColor('background', e.target.value)}
                  className="w-8 h-8 rounded-full border border-white/20 bg-transparent cursor-pointer mx-auto block"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium text-xs hover:opacity-95 shadow-md shadow-indigo-500/20"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
