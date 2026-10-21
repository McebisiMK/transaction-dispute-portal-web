import { buildTheme } from '../utils/createTheme';
import { registerTheme } from '../utils/themeRegistry';
import { palette } from '../tokens/colors';
import { shadow } from '../tokens/shadows';

const lightTheme = buildTheme({
  palette: {
    mode:       'light',
    primary:    { main: palette.navy[800], light: palette.navy[600], dark: palette.navy[900], contrastText: palette.white },
    secondary:  { main: palette.red[600], light: palette.red[400], dark: palette.red[700], contrastText: palette.white },
    background: { default: palette.white, paper: palette.white },
    text:       { primary: palette.black, secondary: palette.gray[500] },
    divider:    palette.gray[300],
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border:          `1px solid ${palette.black}`,
          boxShadow:       shadow.sm,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: palette.black,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

registerTheme('light', () => lightTheme);
