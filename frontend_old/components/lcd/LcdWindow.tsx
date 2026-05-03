import React from "react";
import { useTheme } from "../themes/ThemeProvider";
import { LcdRow } from "./LcdRow";

export interface LcdWindowProps {
  rows?: number;          // number of text rows, default 2
  cellsPerRow?: number;   // chars per row, default 12
  colsPerCell?: number;   // pixels per cell horizontally, default 5
  rowsPerCell?: number;   // pixels per cell vertically, default 8
  // later: bitmaps[rowIndex][cellIndex][row][col]
  bitmaps?: boolean[][][][];
}

export const LcdWindow: React.FC<LcdWindowProps> = ({
  rows = 2,
  cellsPerRow = 16,
  colsPerCell = 5,
  rowsPerCell = 8,
  bitmaps,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="inline-flex flex-col justify-center"
      style={{
        padding: "8px 12px",
      }}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <LcdRow
          key={rowIndex}
          cells={cellsPerRow}
          colsPerCell={colsPerCell}
          rowsPerCell={rowsPerCell}
          bitmaps={bitmaps?.[rowIndex]}
        />
      ))}
    </div>
  );
};
