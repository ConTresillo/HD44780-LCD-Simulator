/**
 * ThemeProvider.tsx — Context-based theme system.
 * Injects CSS variables into :root for global access.
 * Inherits the design from frontend_old.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '../styles/theme';
import { neonBlue, THEMES } from '../styles/theme';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: neonBlue,
  setTheme: () => {},
  themes: THEMES,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(neonBlue);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.core.background);
    root.style.setProperty('--app-surface', theme.core.surface);
    root.style.setProperty('--app-border', theme.core.border);
    root.style.setProperty('--app-text', theme.core.primary);
    root.style.setProperty('--app-muted', theme.core.muted);
    root.style.setProperty('--app-font', theme.core.bodyFont);
    root.style.setProperty('--app-heading-font', theme.core.headingFont);
    root.style.setProperty('--lcd-pixel-on', theme.lcd.pixelOn);
    root.style.setProperty('--lcd-pixel-off', theme.lcd.pixelOff);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}
