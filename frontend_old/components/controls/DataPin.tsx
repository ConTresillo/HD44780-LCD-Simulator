// DataPin.tsx
import React, { useState } from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface DataPinProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}

export const DataPin: React.FC<DataPinProps> = ({ label, active, onClick }) => {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  // single bg for all states: dark pill
  const background = theme.dataPin.inactiveBg;

  let borderColor = theme.dataPin.inactiveBorder;
  let color = theme.dataPin.inactiveText;
  let boxShadow: string | undefined = "none";
  let scale = 1.0;

  if (hovered && !active) {
    borderColor = theme.dataPin.hoverBorder ?? theme.dataPin.inactiveBorder;
    color = theme.dataPin.hoverText ?? theme.dataPin.inactiveText;
    scale = 1.02;
  }

  if (active) {
    borderColor = theme.dataPin.activeBorder;
    color = theme.dataPin.activeText;
    boxShadow = theme.dataPin.activeShadow;
    scale = 1.04;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
        w-10 h-10
        rounded
        border
        flex items-center justify-center
        font-mono text-xs
        cursor-pointer select-none
        transition-all duration-160 ease-out
        focus:outline-none focus:ring-1
      "
      style={{
        background,
        borderColor,
        color,
        boxShadow,
        transform: `scale(${scale})`,
        fontFamily: theme.core.bodyFont,
      }}
    >
      {label}
    </button>
  );
};
