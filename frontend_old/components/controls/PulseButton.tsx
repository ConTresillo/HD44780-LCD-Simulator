// src/components/controls/PulseButton.tsx
import React, { useState } from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface PulseButtonProps {
  label: string;
  isActive?: boolean;         // optional so it can be uncontrolled
  onClick?: () => void;
}

export const PulseButton: React.FC<PulseButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  const { theme } = useTheme();
  const [state, setState] = useState<"idle" | "hover" | "active">("idle");

  const styles: Record<"idle" | "hover" | "active", React.CSSProperties> = {
    idle: {
      background: theme.pulseButton.inactiveBg,
      color: theme.pulseButton.inactiveText,
      boxShadow: isActive ? theme.pulseButton.activeShadow : "none",
      transform: "scale(1.0)",
    },
    hover: {
      background: theme.pulseButton.hoverBg,
      color: theme.pulseButton.hoverText,
      boxShadow: isActive ? theme.pulseButton.activeShadow : "none",
      transform: "scale(1.0)",
    },
    active: {
      background: theme.pulseButton.activeBg,
      color: theme.pulseButton.activeText,
      boxShadow: theme.pulseButton.activeShadow,
      transform: "scale(1.04)", // slightly calmer
    },
  };

  return (
    <button
      type="button"
      className="
        w-10 h-10
        rounded
        border
        flex items-center justify-center
        text-xs font-bold
        cursor-pointer select-none
        transition-all duration-250 ease-out
        focus:outline-none focus:ring-1
      "
      style={{
        borderColor: theme.pulseButton.border,
        fontFamily: theme.core.bodyFont,
        ...styles[state],
      }}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("idle")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
