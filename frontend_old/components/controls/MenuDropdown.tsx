// src/components/controls/MenuDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface MenuDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const base: React.CSSProperties = disabled
    ? {
        borderColor: theme.menuDropdown.disabledBorder,
        background: theme.menuDropdown.disabledBg,
        color: theme.menuDropdown.disabledText,
        boxShadow: "none",
      }
    : {
        borderColor: theme.menuDropdown.border,
        background: theme.menuDropdown.background,
        color: theme.menuDropdown.text,
        boxShadow: theme.menuDropdown.shadow,
      };

  return (
    <div ref={ref} className="relative w-full">
      {/* trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="
          w-full px-3 py-2
          rounded border
          text-sm
          flex items-center justify-between
          cursor-pointer select-none
          transition-all duration-150 ease-out
        "
        style={{
          ...base,
          fontFamily: theme.core.bodyFont,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span>{value}</span>
        <span className="text-xs opacity-70">▾</span>
      </button>

      {/* custom menu */}
      {open && !disabled && (
        <div
          className="
            absolute left-0 right-0 mt-1
            max-h-52
            rounded border
            text-sm
            overflow-y-auto
            z-20
          "
          style={{
            borderColor: theme.menuDropdown.border,
            background: theme.menuDropdown.background,
            boxShadow: theme.menuDropdown.shadow,
            fontFamily: theme.core.bodyFont,
            ["--md-hover-bg" as any]: theme.menuDropdown.hoverBg,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="
                  w-full text-left px-3 py-2
                  cursor-pointer select-none
                  transition-colors duration-75
                  hover:bg-[var(--md-hover-bg)]
                "
                style={{
                  color: theme.menuDropdown.text,
                  // no background here, except a border-like feel for selected via inset shadow
                  boxShadow: isSelected
                    ? `inset 0 0 0 1px ${theme.menuDropdown.hoverBg}`
                    : "none",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
