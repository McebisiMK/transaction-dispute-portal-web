import type { Theme } from '@mui/material/styles';

type ThemeFactory = () => Theme;

const registry = new Map<string, ThemeFactory>();

/** Register a theme under a unique string ID.
 *  Call this as a side-effect import inside each theme file. */
export const registerTheme = (id: string, factory: ThemeFactory): void => {
  registry.set(id, factory);
}

/** Resolve a theme by ID. Falls back to 'light' if the ID is unknown. */
export const resolveTheme = (id: string): Theme => {
  const factory = registry.get(id) ?? registry.get('light');
  if (!factory) throw new Error('No themes registered. Import at least one theme file.');
  return factory();
}

export const isRegisteredTheme = (id: string): boolean => {
  return registry.has(id);
}
