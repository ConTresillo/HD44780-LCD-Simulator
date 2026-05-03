import React from "react";
import { useTheme } from "../themes/ThemeProvider";
import { DataPin } from "../controls/DataPin";
import { IconButton } from "../controls/IconButton";
import { MenuDropdown } from "../controls/MenuDropdown";
import { PulseButton } from "../controls/PulseButton";
import { TextInput } from "../controls/TextInput";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { LcdPixel } from "../lcd/LcdPixel";
import { LcdArray } from "../lcd/LcdArray";
import { LcdCell } from "../lcd/LcdCell";
import { LcdRow } from "../lcd/LcdRow";
import { LcdWindow } from "../lcd/LcdWindow";

import type { ControlKey } from "./ComponentTest";

export interface ComponentTestViewProps {
  selectedControl: ControlKey;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSelectControl: (key: ControlKey) => void;

  isDataPinActive: boolean;
  onToggleDataPin: () => void;

  menuValue: string;
  onMenuChange: (value: string) => void;
  menuOptions: string[];

  en: boolean;
  onPulseClick: () => void;

  hexInput: string;
  onHexChange: (value: string) => void;

  toggleOn: boolean;
  onToggleSwitch: () => void;

  pixelLit: boolean;
  onTogglePixel: () => void;

  onExecuteClick: () => void;
}

export const ComponentTestView: React.FC<ComponentTestViewProps> = (props) => {
  const { theme } = useTheme();

const controlOptions: { value: ControlKey; label: string }[] = [
  { value: "dataPin", label: "DataPin" },
  { value: "iconButton", label: "Icon Button" },
  { value: "menuDropdown", label: "Menu Dropdown" },
  { value: "pulseButton", label: "Pulse Button" },
  { value: "textInput", label: "Text Input" },
  { value: "toggleSwitch", label: "Toggle Switch" },
  { value: "lcdPixel", label: "LCD Pixel" },
  { value: "lcdArray", label: "LCD Array" },   // new
  { value: "lcdCell", label: "LCD Cell" },
  { value: "lcdRow", label: "LCD Row" },
  { value: "lcdWindow", label: "LCD Window" },

];


  const current =
    controlOptions.find((o) => o.value === props.selectedControl) ??
    controlOptions[0];

  const renderControl = () => {
    switch (props.selectedControl) {
      case "dataPin":
        return (
          <DataPin
            label="D0"
            active={props.isDataPinActive}
            onClick={props.onToggleDataPin}
          />
        );

      case "iconButton":
        return (
          <IconButton
            label="EXECUTE"
            onClick={props.onExecuteClick}
          />
        );

      case "menuDropdown":
        return (
          <MenuDropdown
            value={props.menuValue}
            options={props.menuOptions}
            onChange={props.onMenuChange}
          />
        );

      case "pulseButton":
        return (
          <PulseButton
            label="EN"
            isActive={props.en}
            onClick={props.onPulseClick}
          />
        );

      case "textInput":
        return (
          <TextInput
            value={props.hexInput}
            placeholder="e.g. 0x4A"
            onChange={props.onHexChange}
          />
        );

      case "toggleSwitch":
        return (
          <ToggleSwitch
            active={props.toggleOn}
            onClick={props.onToggleSwitch}
          />
        );

      case "lcdPixel":
      return (
        <button
          type="button"
          onMouseDown={(e) => {
            // left button = 0, require Shift
            if (e.button === 0 && e.shiftKey) {
              e.preventDefault();
              props.onTogglePixel();
            }
          }}
          className="p-3 rounded bg-transparent border border-transparent flex items-center justify-center"
        >
          <LcdPixel lit={props.pixelLit} />
        </button>
      );

      case "lcdArray":
      return (
        <LcdArray/>
      );

       case "lcdCell":
      return <LcdCell/>;

      case "lcdRow":
      return <LcdRow />;

      case "lcdWindow":
      return <LcdWindow />;

      default:
        return (
          <div className="text-sm opacity-80">
            Component under construction.
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-6"
      style={{ backgroundColor: theme.core.background }}
    >
      <div
        className="w-full md:w-auto md:min-w-[24rem] rounded-xl p-4"
        style={{
          background: theme.panel.background,
          border: `1px solid ${theme.panel.border}`,
          boxShadow: theme.menuDropdown.shadow,
          fontFamily: theme.core.bodyFont,
          color: theme.core.primary,
        }}
      >
        <h1
          className="mb-4 text-sm"
          style={{
            fontFamily: theme.core.headingFont,
            color: theme.navbar.heading,
          }}
        >
          Controls Playground
        </h1>

        {/* control selector */}
        <div className="mb-4 inline-block relative">
          <button
            type="button"
            onClick={props.onToggleDropdown}
            className="px-3 py-2 rounded-md text-sm w-64 text-left"
            style={{
              background: theme.menuDropdown.background,
              border: `1px solid ${theme.menuDropdown.border}`,
              color: theme.menuDropdown.text,
              boxShadow: theme.menuDropdown.shadow,
              fontFamily: theme.core.bodyFont,
            }}
          >
            {current.label}
            <span className="float-right opacity-70">▾</span>
          </button>

          {props.isDropdownOpen && (
            <div
              className="absolute mt-1 w-64 rounded-md overflow-hidden z-10"
              style={{
                background: theme.menuDropdown.background,
                border: `1px solid ${theme.menuDropdown.border}`,
                boxShadow: theme.menuDropdown.shadow,
              }}
            >
              {controlOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => props.onSelectControl(opt.value)}
                  className="block w-full text-left px-3 py-2 text-sm"
                  style={{
                    color: theme.menuDropdown.text,
                    background:
                      opt.value === current.value
                        ? theme.menuDropdown.hoverBg
                        : "transparent",
                    fontFamily: theme.core.bodyFont,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* demo area */}
        <div
          className="mt-4 p-4 rounded-lg"
          style={{
            background: theme.panel.background,
            border: `1px solid ${theme.panel.border}`,
          }}
        >
          {renderControl()}
        </div>
      </div>
    </div>
  );
};
