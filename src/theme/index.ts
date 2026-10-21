// ── Side-effect imports: register all built-in themes into the registry ──────
import './themes/light';
import './themes/dark';
// To add a new theme: create src/theme/themes/banking.ts and import it here.

// ── Context ──────────────────────────────────────────────────────────────────
export { useAppTheme } from './context/ThemeContext';
export type { ThemeContextValue } from './context/ThemeContext';

// ── Components ────────────────────────────────────────────────────────────────
export { AppThemeProvider } from './components';
export { ThemeSettings }   from './components';
export { ThemeToggle }     from './components';
