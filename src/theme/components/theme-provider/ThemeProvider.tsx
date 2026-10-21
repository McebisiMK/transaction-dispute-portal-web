import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { isRegisteredTheme } from '../../utils/themeRegistry';
import { CONFIG } from '@/config-global';

/* ================================================================================================================================ */

const getInitialThemeId = (): string => {
  const stored = localStorage.getItem(CONFIG.storageKeys.theme);
  if (stored && isRegisteredTheme(stored)) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : CONFIG.defaultTheme;
}

/** Provides ThemeContext — manages theme state, localStorage sync, and OS detection. */
const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeIdState] = useState<string>(getInitialThemeId);

  useEffect(() => {
    localStorage.setItem(CONFIG.storageKeys.theme, themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  }, [themeId]);

  const setThemeId = (id: string) => {
    if (isRegisteredTheme(id)) setThemeIdState(id);
  };

  const toggleTheme = () =>
    setThemeIdState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ================================================================================================================================ */

export default AppThemeProvider;
