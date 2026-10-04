// Central dark theme inspired by the Inspo-UI "Black-UI" Tesla-style design.
// These tokens mirror the palette hardcoded throughout the inspiration screens
// (its own `@/theme` file was missing, so values were reconstructed from usage).

export const colors = {
  // Backgrounds / surfaces
  background: '#0E0F11',
  backgroundDeep: '#070809',
  surface: '#17191D',
  surfaceAlt: '#14171B',
  surfaceMuted: '#101216',
  card: '#171A1E',
  cardElevated: '#1C1F23',

  // Borders / strokes
  border: '#23272C',
  borderStrong: '#2C3138',
  hairline: '#2B2F34',

  // Text
  text: '#FFFFFF',
  textSecondary: '#C6CBD2',
  textMuted: '#8A9099',
  textDim: '#6A7078',
  icon: '#B9BFC7',

  // Accents
  accent: '#2FB8FF',
  teal: '#9EECD9',
  glow: '#2FB8FF',

  // Semantic
  white: '#FFFFFF',
  warning: '#FFD52C',
  green: '#10B981',
  red: '#EF4444',
};

export const gradients = {
  // App background: near-black with a subtle vertical lift.
  background: ['#0E0F11', '#0A0C0E', '#070809'],
  // Screen background used behind tabs / content.
  screen: ['#111417', '#0C0E10', '#08090B'],
  // Card fill: subtle top-left highlight.
  card: ['#1C1F23', '#15181C'],
  // Primary action gradient (cyan -> teal), horizontal.
  primary: ['#2FB8FF', '#9EECD9'],
  // Surface for inputs / elevated chips.
  surface: ['#17191D', '#14171B'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 30,
  xxl: 40,
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

// Reusable shadow presets (iOS + Android elevation).
export const shadows = {
  glow: {
    shadowColor: colors.glow,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};

export default { colors, gradients, spacing, radii, shadows };
