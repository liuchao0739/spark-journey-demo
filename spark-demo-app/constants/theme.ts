export const colors = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceLight: '#333333',
  primary: '#58cc02',
  primaryDark: '#4aad02',
  gold: '#ffc800',
  goldDark: '#e5a800',
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',
  border: '#3f3f46',
  locked: '#4b5563',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontScales = {
  sm: 0.9,
  md: 1,
  lg: 1.15,
} as const;

export type FontScaleKey = keyof typeof fontScales;
