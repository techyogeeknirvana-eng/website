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
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  typography: 'space-grotesk',
  density: 'comfortable',
  motion: 'full',
  background: 'grid',
};

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
