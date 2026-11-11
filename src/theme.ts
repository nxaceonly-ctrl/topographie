// Identité visuelle AZIMUT : interface "HUD" claire et froide, filets fins,
// coins en équerre, accent bleu glacier. Passe en sombre avec le téléphone.
import { createContext, useContext } from 'react';

export const light = {
  dark: false,
  bg: '#E8ECF0',
  bg2: '#DCE2E8',
  panel: 'rgba(255,255,255,0.78)',
  line: 'rgba(30,50,70,0.16)',
  line2: 'rgba(30,50,70,0.32)',
  text: '#141C24',
  dim: '#5C6B78',
  faint: '#8D99A4',
  acc: '#1597D6',
  accSoft: 'rgba(21,151,214,0.12)',
  ok: '#14A37F',
  okSoft: 'rgba(20,163,127,0.12)',
  bad: '#D93A4A',
  warn: '#B87D0C',
  rose: '#FFFFFF',
  onAcc: '#FFFFFF',
};
export type Theme = typeof light;

export const dark: Theme = {
  dark: true,
  bg: '#0B1117',
  bg2: '#101922',
  panel: 'rgba(20,30,40,0.85)',
  line: 'rgba(170,200,225,0.14)',
  line2: 'rgba(170,200,225,0.30)',
  text: '#E6EDF3',
  dim: '#8B9AA8',
  faint: '#5D6B78',
  acc: '#3FB8F0',
  accSoft: 'rgba(63,184,240,0.12)',
  ok: '#2FD1A3',
  okSoft: 'rgba(47,209,163,0.12)',
  bad: '#FF5A6A',
  warn: '#E8B44C',
  rose: '#15212C',
  onAcc: '#06121B',
};

export const fonts = {
  disp: 'ChakraPetch_600SemiBold',
  dispBold: 'ChakraPetch_700Bold',
  body: 'Barlow_400Regular',
  bodyMed: 'Barlow_500Medium',
  bodyBold: 'Barlow_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_600SemiBold',
};

export const ThemeCtx = createContext<Theme>(light);
export const useTheme = () => useContext(ThemeCtx);
