import { createTheme as muiCreateTheme, type ThemeOptions, type Theme } from '@mui/material/styles';
import { fontFamily, fontWeight } from '../tokens/typography';
import { borderRadius } from '../tokens/spacing';

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily,
    h1: { fontWeight: fontWeight.bold,     letterSpacing: '-0.03em' },
    h2: { fontWeight: fontWeight.semibold },
    h3: { fontWeight: fontWeight.semibold },
    h4: { fontWeight: fontWeight.semibold },
    subtitle1: { fontWeight: fontWeight.medium },
    subtitle2: { fontWeight: fontWeight.semibold },
  },
  shape: { borderRadius: borderRadius.md },
};

/** Merge base token defaults with per-theme overrides to produce a full MUI Theme. */
export const buildTheme = (options: ThemeOptions): Theme => {
  return muiCreateTheme({ ...baseOptions, ...options });
}
