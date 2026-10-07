'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_PRESETS, FONT_PRESETS, ThemePreset, FontPreset } from '@/lib/theme/themeConfig';

interface CustomColors {
  primary?: string;
  accent?: string;
  background?: string;
}

interface ThemeCustomizerContextType {
  activeTheme: ThemePreset;
  activeFont: FontPreset;
  customColors: CustomColors;
  glassIntensity: number;
  gradientIntensity: number;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  setTheme: (themeId: string) => void;
  setFont: (fontId: string) => void;
  setCustomColor: (key: keyof CustomColors, color: string) => void;
  setGlassIntensity: (intensity: number) => void;
  setGradientIntensity: (intensity: number) => void;
  resetToDefaults: () => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveThemeState] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [activeFont, setActiveFontState] = useState<FontPreset>(FONT_PRESETS[0]);
  const [customColors, setCustomColorsState] = useState<CustomColors>({});
  const [glassIntensity, setGlassIntensityState] = useState<number>(0.65);
  const [gradientIntensity, setGradientIntensityState] = useState<number>(0.8);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('tygn_theme_preset');
      if (savedThemeId) {
        const found = THEME_PRESETS.find(t => t.id === savedThemeId);
        if (found) setActiveThemeState(found);
      }

      const savedFontId = localStorage.getItem('tygn_font_preset');
      if (savedFontId) {
        const found = FONT_PRESETS.find(f => f.id === savedFontId);
        if (found) setActiveFontState(found);
      }

      const savedColors = localStorage.getItem('tygn_custom_colors');
      if (savedColors) {
        setCustomColorsState(JSON.parse(savedColors));
      }

      const savedGlass = localStorage.getItem('tygn_glass_intensity');
      if (savedGlass) setGlassIntensityState(parseFloat(savedGlass));

      const savedGrad = localStorage.getItem('tygn_gradient_intensity');
      if (savedGrad) setGradientIntensityState(parseFloat(savedGrad));
    } catch (_) {}
  }, []);

  // Synchronize CSS variables to :root
  useEffect(() => {
    const root = document.documentElement;

    const bgPrimary = customColors.background || activeTheme.bgPrimary;
    const accentPrimary = customColors.primary || activeTheme.accentPrimary;
    const accentSecondary = customColors.accent || activeTheme.accentSecondary;

    root.style.setProperty('--bg-primary', bgPrimary);
    root.style.setProperty('--bg-secondary', activeTheme.bgSecondary);
    root.style.setProperty('--bg-tertiary', activeTheme.bgTertiary);
    root.style.setProperty('--accent-indigo', accentPrimary);
    root.style.setProperty('--accent-cyan', accentSecondary);
    root.style.setProperty('--accent-violet', accentPrimary);
    root.style.setProperty('--text-primary', activeTheme.textPrimary);
    root.style.setProperty('--text-secondary', activeTheme.textSecondary);
    root.style.setProperty('--border-subtle', activeTheme.borderSubtle);
    root.style.setProperty('--bg-surface', `rgba(19, 27, 44, ${glassIntensity})`);
    root.style.setProperty('--bg-glass-card', `rgba(19, 27, 44, ${glassIntensity})`);
    root.style.setProperty('--font-sans', activeFont.bodyFont);
    root.style.setProperty('--font-display', activeFont.displayFont);
    root.style.setProperty('--font-mono', activeFont.monoFont);

    // Dynamic gradient token
    root.style.setProperty(
      '--gradient-nirvana',
      `linear-gradient(135deg, ${accentSecondary} 0%, ${accentPrimary} 60%, #8b5cf6 100%)`
    );

    // Set data-theme for compatibility with existing components
    root.setAttribute('data-theme', activeTheme.isLight ? 'light' : 'dark');
  }, [activeTheme, activeFont, customColors, glassIntensity, gradientIntensity]);

  const setTheme = (themeId: string) => {
    const found = THEME_PRESETS.find(t => t.id === themeId);
    if (found) {
      setActiveThemeState(found);
      setCustomColorsState({}); // reset custom overrides when preset changes
      localStorage.setItem('tygn_theme_preset', themeId);
      localStorage.removeItem('tygn_custom_colors');
    }
  };

  const setFont = (fontId: string) => {
    const found = FONT_PRESETS.find(f => f.id === fontId);
    if (found) {
      setActiveFontState(found);
      localStorage.setItem('tygn_font_preset', fontId);
    }
  };

  const setCustomColor = (key: keyof CustomColors, color: string) => {
    const updated = { ...customColors, [key]: color };
    setCustomColorsState(updated);
    localStorage.setItem('tygn_custom_colors', JSON.stringify(updated));
  };

  const setGlassIntensity = (intensity: number) => {
    setGlassIntensityState(intensity);
    localStorage.setItem('tygn_glass_intensity', intensity.toString());
  };

  const setGradientIntensity = (intensity: number) => {
    setGradientIntensityState(intensity);
    localStorage.setItem('tygn_gradient_intensity', intensity.toString());
  };

  const resetToDefaults = () => {
    setActiveThemeState(THEME_PRESETS[0]);
    setActiveFontState(FONT_PRESETS[0]);
    setCustomColorsState({});
    setGlassIntensityState(0.65);
    setGradientIntensityState(0.8);
    localStorage.removeItem('tygn_theme_preset');
    localStorage.removeItem('tygn_font_preset');
    localStorage.removeItem('tygn_custom_colors');
    localStorage.removeItem('tygn_glass_intensity');
    localStorage.removeItem('tygn_gradient_intensity');
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
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
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error('useThemeCustomizer must be used within a ThemeCustomizerProvider');
  }
  return context;
}
