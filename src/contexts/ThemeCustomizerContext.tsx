'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  UserPreferences, 
  DEFAULT_PREFERENCES, 
  ThemeMode, 
  TypographyChoice, 
  DensityChoice, 
  MotionChoice, 
  BackgroundChoice,
  TYPOGRAPHY_OPTIONS
} from '@/lib/theme/themeConfig';

interface ThemeCustomizerContextType {
  preferences: UserPreferences;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setTypography: (typography: TypographyChoice) => void;
  setDensity: (density: DensityChoice) => void;
  setMotion: (motion: MotionChoice) => void;
  setBackground: (background: BackgroundChoice) => void;
  setFontColor: (color: string) => void;
  setDevMode: (enabled: boolean) => void;
  toggleDevMode: () => void;
  toggleTheme: () => void;
  resetToDefaults: () => void;
  isDark: boolean;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

const STORAGE_KEY = 'tygn_monochrome_preferences';

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } else {
        // System preference default
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setPreferences(prev => ({
          ...prev,
          theme: prefersDark ? 'dark' : 'light'
        }));
      }
    } catch (_) {}
    setMounted(true);
  }, []);

  // Compute actual active theme (dark or light)
  const isDark = preferences.theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : preferences.theme === 'dark';

  // Apply CSS variables and classes to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // 1. Theme
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // 2. Typography
    const fontOption = TYPOGRAPHY_OPTIONS.find(f => f.id === preferences.typography) || TYPOGRAPHY_OPTIONS[0];
    root.style.setProperty('--font-display', fontOption.displayFont);
    root.style.setProperty('--font-sans', fontOption.bodyFont);

    // 3. Density
    if (preferences.density === 'compact') {
      root.style.setProperty('--density-gap', '12px');
      root.style.setProperty('--density-padding', '12px');
    } else if (preferences.density === 'spacious') {
      root.style.setProperty('--density-gap', '28px');
      root.style.setProperty('--density-padding', '32px');
    } else {
      root.style.setProperty('--density-gap', '20px');
      root.style.setProperty('--density-padding', '24px');
    }

    // 4. Motion
    if (preferences.motion === 'reduced') {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // 5. Background mode
    root.setAttribute('data-bg-mode', preferences.background);

    // 6. Custom font color
    if (preferences.fontColor && preferences.fontColor !== 'default') {
      root.setAttribute('data-custom-font', 'true');
      root.style.setProperty('--user-font-color', preferences.fontColor);
      root.style.setProperty('--text-primary', preferences.fontColor);
    } else {
      root.removeAttribute('data-custom-font');
      root.style.removeProperty('--user-font-color');
      root.style.setProperty('--text-primary', isDark ? '#ffffff' : '#050505');
    }

    // 7. Dev Mode
    if (preferences.devMode) {
      root.setAttribute('data-dev-mode', 'true');
    } else {
      root.removeAttribute('data-dev-mode');
    }

    // Save to localStorage
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (_) {}
    }
  }, [preferences, isDark, mounted]);

  const setTheme = (theme: ThemeMode) => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setTypography = (typography: TypographyChoice) => {
    setPreferences(prev => ({ ...prev, typography }));
  };

  const setDensity = (density: DensityChoice) => {
    setPreferences(prev => ({ ...prev, density }));
  };

  const setMotion = (motion: MotionChoice) => {
    setPreferences(prev => ({ ...prev, motion }));
  };

  const setBackground = (background: BackgroundChoice) => {
    setPreferences(prev => ({ ...prev, background }));
  };

  const setFontColor = (fontColor: string) => {
    setPreferences(prev => ({ ...prev, fontColor }));
  };

  const setDevMode = (devMode: boolean) => {
    setPreferences(prev => ({ ...prev, devMode }));
  };

  const toggleDevMode = () => {
    setPreferences(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: isDark ? 'light' : 'dark'
    }));
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
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
        toggleTheme,
        resetToDefaults,
        isDark,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error('useThemeCustomizer must be used within ThemeCustomizerProvider');
  }
  return context;
}
