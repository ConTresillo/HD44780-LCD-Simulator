import React, { useState } from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface IconButtonProps {
  label: string;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ label, onClick }) => {
  const { theme } = useTheme();
  const [state, setState] = useState<"idle" | "hover" | "active">("idle");

  const styles: Record<typeof state, React.CSSProperties> = {
    idle: {
      background: theme.iconButton.inactiveBg,
      color: theme.iconButton.inactiveText,
      boxShadow: "none",
      transform: "scale(1)",
    },
    hover: {
      background: theme.iconButton.hoverBg,
      color: theme.iconButton.hoverText,
      boxShadow: "none",
      transform: "scale(1)",
    },
    active: {
      background: theme.iconButton.activeBg,
      color: theme.iconButton.activeText,
      boxShadow: theme.iconButton.activeShadow,
      transform: "scale(1.04)",
    },
  };

  return (
    <button
      type="button"
      className="px-4 py-2 rounded border flex items-center justify-center
                 text-xs font-bold cursor-pointer select-none
                 transition-all duration-400 ease-out
                 focus:outline-none focus:ring-1"
      style={{
        borderColor: theme.iconButton.border,
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

