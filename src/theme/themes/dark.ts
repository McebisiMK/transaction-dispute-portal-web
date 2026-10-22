import { buildTheme } from '../utils/createTheme';
import { registerTheme } from '../utils/themeRegistry';
import { palette } from '../tokens/colors';
import { shadow } from '../tokens/shadows';

const darkTheme = buildTheme({
  palette: {
    mode:       'dark',
    primary:    { main: palette.navy[300], light: palette.navy[200], dark: palette.navy[400], contrastText: palette.navy[950] },
    secondary:  { main: palette.red[400], light: palette.red[300], dark: palette.red[500], contrastText: palette.white },
    background: { default: palette.gray[950], paper: palette.gray[900] },
    text:       { primary: palette.white, secondary: palette.gray[300] },
    divider:    palette.gray[700],
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border:          `1px solid ${palette.gray[700]}`,
          boxShadow:       shadow.none,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: palette.gray[700],
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: palette.gray[600],
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: palette.gray[300],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '&.MuiButton-outlined': {
              borderColor: palette.gray[700],
              color: palette.gray[500],
            },
            '&.MuiButton-contained': {
              backgroundColor: palette.gray[800],
              color: palette.gray[500],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

registerTheme('dark', () => darkTheme);
