export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  accentPrimary: string;
  accentSecondary: string;
  textPrimary: string;
  textSecondary: string;
  borderSubtle: string;
  glassSurface: string;
  isLight?: boolean;
}

export interface FontPreset {
  id: string;
  name: string;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Deep cosmic void with violet & cyan',
    bgPrimary: '#07090e',
    bgSecondary: '#0d121d',
    bgTertiary: '#131b2c',
    accentPrimary: '#6366f1',
    accentSecondary: '#06b6d4',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    glassSurface: 'rgba(19, 27, 44, 0.65)'
  },
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    tagline: 'Electric neon cyan and deep grid navy',
    bgPrimary: '#030b1e',
    bgSecondary: '#061330',
    bgTertiary: '#0a1d46',
    accentPrimary: '#00e5ff',
    accentSecondary: '#3b82f6',
    textPrimary: '#f0f9ff',
    textSecondary: '#7dd3fc',
    borderSubtle: 'rgba(0, 229, 255, 0.16)',
    glassSurface: 'rgba(6, 19, 48, 0.75)'
  },
  {
    id: 'electric-purple',
    name: 'Electric Purple',
    tagline: 'Futuristic synthwave violet and magenta',
    bgPrimary: '#090514',
    bgSecondary: '#120b24',
    bgTertiary: '#1b1236',
    accentPrimary: '#a855f7',
    accentSecondary: '#ec4899',
    textPrimary: '#faf5ff',
    textSecondary: '#d8b4fe',
    borderSubtle: 'rgba(168, 85, 247, 0.18)',
    glassSurface: 'rgba(18, 11, 36, 0.75)'
  },
  {
    id: 'neon-green',
    name: 'Neon Green',
    tagline: 'Cyberpunk terminal emerald & matrix glow',
    bgPrimary: '#03120b',
    bgSecondary: '#051d12',
    bgTertiary: '#082a1a',
    accentPrimary: '#10b981',
    accentSecondary: '#06b6d4',
    textPrimary: '#ecfdf5',
    textSecondary: '#6ee7b7',
    borderSubtle: 'rgba(16, 185, 129, 0.18)',
    glassSurface: 'rgba(5, 29, 18, 0.75)'
  },
  {
    id: 'crimson',
    name: 'Crimson',
    tagline: 'Sleek ruby cyberpunk energy',
    bgPrimary: '#120407',
    bgSecondary: '#1d070c',
    bgTertiary: '#2c0b13',
    accentPrimary: '#f43f5e',
    accentSecondary: '#fb7185',
    textPrimary: '#fff1f2',
    textSecondary: '#fda4af',
    borderSubtle: 'rgba(244, 63, 94, 0.18)',
    glassSurface: 'rgba(29, 7, 12, 0.75)'
  },
  {
    id: 'amber',
    name: 'Amber',
    tagline: 'Warm cyber gold and technical sunburst',
    bgPrimary: '#120c03',
    bgSecondary: '#1f1406',
    bgTertiary: '#2e1e0a',
    accentPrimary: '#f59e0b',
    accentSecondary: '#f97316',
    textPrimary: '#fffbeb',
    textSecondary: '#fcd34d',
    borderSubtle: 'rgba(245, 158, 11, 0.18)',
    glassSurface: 'rgba(31, 20, 6, 0.75)'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    tagline: 'Ice crystal blue & glacier silver',
    bgPrimary: '#060e17',
    bgSecondary: '#0c1827',
    bgTertiary: '#132439',
    accentPrimary: '#38bdf8',
    accentSecondary: '#818cf8',
    textPrimary: '#f0f9ff',
    textSecondary: '#bae6fd',
    borderSubtle: 'rgba(56, 189, 248, 0.16)',
    glassSurface: 'rgba(12, 24, 39, 0.75)'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    tagline: 'Deep marine teal and oceanic gradients',
    bgPrimary: '#041014',
    bgSecondary: '#071c22',
    bgTertiary: '#0c2831',
    accentPrimary: '#14b8a6',
    accentSecondary: '#0284c7',
    textPrimary: '#f0fdfa',
    textSecondary: '#5eead4',
    borderSubtle: 'rgba(20, 184, 166, 0.18)',
    glassSurface: 'rgba(7, 28, 34, 0.75)'
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    tagline: 'Crisp editorial daylight with high clarity',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    accentPrimary: '#4f46e5',
    accentSecondary: '#0284c7',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    borderSubtle: 'rgba(15, 23, 42, 0.10)',
    glassSurface: 'rgba(255, 255, 255, 0.92)',
    isLight: true
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    tagline: 'True 000000 OLED pure black with high contrast',
    bgPrimary: '#000000',
    bgSecondary: '#080808',
    bgTertiary: '#121212',
    accentPrimary: '#00f5d4',
    accentSecondary: '#7b2cbf',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    borderSubtle: 'rgba(255, 255, 255, 0.14)',
    glassSurface: 'rgba(10, 10, 10, 0.85)'
  }
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'tech',
    name: 'Tech',
    displayFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    description: 'Space Grotesk + Inter (High-energy technical aesthetic)'
  },
  {
    id: 'modern',
    name: 'Modern',
    displayFont: "'Manrope', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    description: 'Manrope + Inter (Apple-level clean composition)'
  },
  {
    id: 'developer',
    name: 'Developer',
    displayFont: "'JetBrains Mono', monospace",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    description: 'JetBrains Mono + Inter (Monospace headings for coders)'
  },
  {
    id: 'professional',
    name: 'Professional',
    displayFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    description: 'Plus Jakarta Sans + Inter (Polished institutional prestige)'
  }
];
