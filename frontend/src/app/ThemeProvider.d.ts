/**
 * ThemeProvider.tsx — Context-based theme system.
 * Injects CSS variables into :root for global access.
 * Inherits the design from frontend_old.
 */
import React from 'react';
import type { Theme } from '../styles/theme';
type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
    themes: Theme[];
};
export declare const useTheme: () => ThemeContextValue;
export declare function ThemeProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map