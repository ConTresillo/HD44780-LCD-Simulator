import React from "react";
import { ComponentTestView } from "./ComponentTest.view";

export type ControlKey =
  | "dataPin"
  | "iconButton"
  | "menuDropdown"
  | "pulseButton"
  | "textInput"
  | "toggleSwitch"
  | "lcdPixel"
  | "lcdArray"
  | "lcdCell"
  | "lcdRow"
  | "lcdWindow";


const defaultMenuOptions = [
  "Clear Display",
  "Return Home",
  "Move Cursor Left",
  "Move Cursor Right",
];

const ComponentTest: React.FC = () => {
  const [selectedControl, setSelectedControl] =
    React.useState<ControlKey>("dataPin");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [isDataPinActive, setIsDataPinActive] = React.useState(false);
  const [menuValue, setMenuValue] = React.useState("Clear Display");
  const [en, setEn] = React.useState(false);
  const [hexInput, setHexInput] = React.useState("");
  const [toggleOn, setToggleOn] = React.useState(false);
  const [pixelLit, setPixelLit] = React.useState(false);

  const handlePulse = () => {
    setEn(true);
    setTimeout(() => setEn(false), 200);
  };

  const handleSelectControl = (key: ControlKey) => {
    setSelectedControl(key);
    setIsDropdownOpen(false);
    console.log("Control changed to:", key);
  };

  const handleMenuChange = (value: string) => {
    setMenuValue(value);
    console.log("Menu changed:", value);
  };

  const handleExecuteClick = () => {
    console.log("EXECUTE from ComponentTest");
  };

  return (
    <ComponentTestView
      selectedControl={selectedControl}
      isDropdownOpen={isDropdownOpen}
      onToggleDropdown={() => setIsDropdownOpen((o) => !o)}
      onSelectControl={handleSelectControl}
      isDataPinActive={isDataPinActive}
      onToggleDataPin={() => setIsDataPinActive((v) => !v)}
      menuValue={menuValue}
      onMenuChange={handleMenuChange}
      menuOptions={defaultMenuOptions}
      en={en}
      onPulseClick={handlePulse}
      hexInput={hexInput}
      onHexChange={setHexInput}
      toggleOn={toggleOn}
      onToggleSwitch={() => setToggleOn((v) => !v)}
      pixelLit={pixelLit}
      onTogglePixel={() => setPixelLit((v) => !v)}
      onExecuteClick={handleExecuteClick}
    />
  );
};

export default ComponentTest;
