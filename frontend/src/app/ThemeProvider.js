import { jsx as _jsx } from "react/jsx-runtime";
/**
 * ThemeProvider.tsx — Context-based theme system.
 * Injects CSS variables into :root for global access.
 * Inherits the design from frontend_old.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { neonBlue, THEMES } from '../styles/theme';
const ThemeContext = createContext({
    theme: neonBlue,
    setTheme: () => { },
    themes: THEMES,
});
export const useTheme = () => useContext(ThemeContext);
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(neonBlue);
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
    return (_jsx(ThemeContext.Provider, { value: { theme, setTheme, themes: THEMES }, children: children }));
}
//# sourceMappingURL=ThemeProvider.js.map