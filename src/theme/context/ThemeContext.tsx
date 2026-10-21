import { createContext, useContext } from 'react';

export interface ThemeContextValue {
  /** ID of the currently active theme (e.g. 'light', 'dark', 'banking'). */
  themeId: string;
  /** Switch to any registered theme by ID. No-ops for unknown IDs. */
  setThemeId: (id: string) => void;
  /** Convenience toggle between 'light' and 'dark'. */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside <AppThemeProvider>');
  return ctx;
}
