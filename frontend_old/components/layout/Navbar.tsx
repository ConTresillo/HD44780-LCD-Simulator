// src/components/layout/Navbar.tsx
import React from "react";
import { useTheme } from "../themes/ThemeProvider";

type NavbarProps = {
  onOpenSettings: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { theme } = useTheme();

  return (
    <header
      className="w-full flex items-center justify-between px-4 py-2"
      style={{
        background: theme.navbar.background,
        borderBottom: `1px solid ${theme.navbar.border}`,
        boxShadow: theme.navbar.headingShadow,
        fontFamily: theme.core.bodyFont,
        color: theme.core.primary,
      }}
    >
      <div
        className="text-sm"
        style={{ fontFamily: theme.core.headingFont, color: theme.navbar.heading }}
      >
        LCD Simulator
      </div>

      <button
        onClick={onOpenSettings}
        className="p-1 rounded-full text-xs"
        aria-label="Open settings"
        style={{
          border: `1px solid ${theme.menuDropdown.border}`,
          background: theme.menuDropdown.background,
          color: theme.menuDropdown.text,
          boxShadow: theme.menuDropdown.shadow,
        }}
      >
        ⚙
      </button>
    </header>
  );
};

export default Navbar;
