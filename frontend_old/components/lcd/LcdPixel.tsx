// src/components/lcd/LcdPixel.tsx
import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface LcdPixelProps {
  lit: boolean;
}

export const LcdPixel: React.FC<LcdPixelProps> = ({ lit }) => {
  const { theme } = useTheme();

  return (
    <div
      className="w-[4px] h-[4px] rounded-[1px]"
      style={{
        backgroundColor: lit ? theme.lcd.pixelOn : theme.lcd.pixelOff,
        boxShadow: lit ? `0 0 4px ${theme.lcd.pixelOn}` : "none",
      }}
    />
  );
};
