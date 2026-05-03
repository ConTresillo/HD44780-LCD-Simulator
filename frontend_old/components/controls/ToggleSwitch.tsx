// src/components/controls/ToggleSwitch.tsx
import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface ToggleSwitchProps {
  active: boolean;
  onClick: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  active,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-10
        h-5
        rounded-full
        flex
        items-center
        px-0.5
        transition-all
        duration-200
      "
      style={{
        backgroundColor: active ? theme.toggleSwitch.trackOn : theme.toggleSwitch.trackOff,
        boxShadow: active ? theme.toggleSwitch.glow : "none",
      }}
    >
      <div
        className="
          h-4
          w-4
          rounded-full
          transition-transform
          duration-200
        "
        style={{
          backgroundColor: active ? theme.toggleSwitch.knobOn : theme.toggleSwitch.knobOff,
          transform: active ? "translateX(18px)" : "translateX(0px)",
        }}
      />
    </button>
  );
};
