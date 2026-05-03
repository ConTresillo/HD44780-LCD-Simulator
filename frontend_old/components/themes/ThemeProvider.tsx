// src/components/themes/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "../../../infrastructure/themes/Theme";
import { neonBlue } from "../../../infrastructure/themes/neonBlue";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: neonBlue,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(neonBlue);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-bg", theme.core.background);
    root.style.setProperty("--app-text", theme.core.primary);
    root.style.setProperty("--app-font", theme.core.bodyFont);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
