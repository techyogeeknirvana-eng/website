export type ThemeMode = 'dark' | 'light' | 'system';
export type TypographyChoice = 'space-grotesk' | 'inter' | 'manrope' | 'jetbrains-mono';
export type DensityChoice = 'compact' | 'comfortable' | 'spacious';
export type MotionChoice = 'full' | 'reduced';
export type BackgroundChoice = 'clean' | 'grid' | 'cinematic';

export interface UserPreferences {
  theme: ThemeMode;
  typography: TypographyChoice;
  density: DensityChoice;
  motion: MotionChoice;
  background: BackgroundChoice;
  fontColor?: string;
  devMode?: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  typography: 'space-grotesk',
  density: 'comfortable',
  motion: 'full',
  background: 'grid',
  fontColor: 'default',
  devMode: false,
};

export const FONT_COLOR_PRESETS = [
  { id: 'default', name: 'Auto (Monochrome)', color: '', preview: '#ffffff' },
  { id: '#06b6d4', name: 'Cyber Cyan', color: '#06b6d4', preview: '#06b6d4' },
  { id: '#10b981', name: 'Neon Emerald', color: '#10b981', preview: '#10b981' },
  { id: '#f59e0b', name: 'Amber Flame', color: '#f59e0b', preview: '#f59e0b' },
  { id: '#818cf8', name: 'Electric Indigo', color: '#818cf8', preview: '#818cf8' },
  { id: '#f43f5e', name: 'Crimson Rose', color: '#f43f5e', preview: '#f43f5e' },
  { id: '#a855f7', name: 'Royal Purple', color: '#a855f7', preview: '#a855f7' },
];

export const TYPOGRAPHY_OPTIONS: { id: TypographyChoice; name: string; displayFont: string; bodyFont: string; sample: string }[] = [
  {
    id: 'space-grotesk',
    name: 'Space Grotesk + Inter',
    displayFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    sample: 'Futuristic technical display with high readability',
  },
  {
    id: 'inter',
    name: 'Inter + Inter Tight',
    displayFont: "'Inter Tight', sans-serif",
    bodyFont: "'Inter', sans-serif",
    sample: 'Clean Swiss editorial minimalism',
  },
  {
    id: 'manrope',
    name: 'Manrope Geometric',
    displayFont: "'Manrope', sans-serif",
    bodyFont: "'Manrope', sans-serif",
    sample: 'Modern geometric elegance with open letterforms',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    displayFont: "'JetBrains Mono', monospace",
    bodyFont: "'Inter', sans-serif",
    sample: 'Developer console code aesthetic',
  },
];
