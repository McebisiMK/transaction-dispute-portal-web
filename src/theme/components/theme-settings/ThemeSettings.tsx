import { type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useAppTheme } from '../../context/ThemeContext';
import { resolveTheme } from '../../utils/themeRegistry';

/* ================================================================================================================================ */

/** Bridges ThemeContext → MUI ThemeProvider. Also applies MUI's global CssBaseline. */
const ThemeSettings = ({ children }: { children: ReactNode }) => {
  const { themeId } = useAppTheme();
  const muiTheme = resolveTheme(themeId);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

/* ================================================================================================================================ */

export default ThemeSettings;
