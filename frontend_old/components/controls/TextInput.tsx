// TextInput.tsx
import React from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface TextInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  const { theme } = useTheme();

  const style: React.CSSProperties = {
    fontFamily: theme.core.bodyFont,
    background: theme.textInput.background,
    borderColor: theme.textInput.border,
    color: theme.textInput.text,
    boxShadow: "none",
    // CSS variable for placeholder
    "--ti-placeholder-color": theme.textInput.placeholder,
  } as React.CSSProperties; // allows the custom prop key [web:51][web:56]

  return (
  <input
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="
      rounded
      border
      px-3 py-2
      text-xs
      transition-all duration-180 ease-out
      focus:outline-none
    "
    style={{
      fontFamily: theme.core.bodyFont,
      background: theme.textInput.background,
      borderColor: theme.textInput.border,
      color: theme.textInput.text,
      boxShadow: "none",
      width: "7.5rem", // ≈ IconButton width
      "--ti-placeholder-color": theme.textInput.placeholder,
    } as React.CSSProperties}
      />
    );

};
