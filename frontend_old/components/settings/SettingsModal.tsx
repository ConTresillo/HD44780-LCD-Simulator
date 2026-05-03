// src/components/settings/SettingsModal.tsx
import React from "react";
import { useTheme } from "../themes/ThemeProvider";
import { neonBlue } from "../../../infrastructure/themes/neonBlue";
import { classicGreen } from "../../../infrastructure/themes/classicGreen";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const themeOptions = [
  { id: "neonBlue", label: "Neon Blue", theme: neonBlue },
  { id: "classicGreen", label: "Classic Green", theme: classicGreen },
] as const;

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  const current = themeOptions.find((t) => t.theme === theme) ?? themeOptions[0];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-4"
        style={{
          background: theme.panel.background,
          border: `1px solid ${theme.panel.border}`,
          boxShadow: theme.menuDropdown.shadow,
          fontFamily: theme.core.bodyFont,
          color: theme.core.primary,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-sm"
            style={{ fontFamily: theme.core.headingFont, color: theme.navbar.heading }}
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded"
            style={{
              border: `1px solid ${theme.menuDropdown.border}`,
              background: theme.menuDropdown.background,
              color: theme.menuDropdown.text,
            }}
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div
            className="text-xs mb-1"
            style={{ color: theme.panel.label }}
          >
            Theme
          </div>

          <div className="relative inline-block w-full">
            <select
              value={current.id}
              onChange={(e) => {
                const next = themeOptions.find((t) => t.id === e.target.value);
                if (next) setTheme(next.theme);
              }}
              className="w-full text-sm rounded-md px-3 py-2 bg-transparent outline-none"
              style={{
                background: theme.menuDropdown.background,
                border: `1px solid ${theme.menuDropdown.border}`,
                color: theme.menuDropdown.text,
                boxShadow: theme.menuDropdown.shadow,
                fontFamily: theme.core.bodyFont,
              }}
            >
              {themeOptions.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  style={{ color: "#000000" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
