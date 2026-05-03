import React from "react";
import { LcdCell } from "./LcdCell";

export interface LcdRowProps {
  cells?: number;            // how many character cells, default 12
  colsPerCell?: number;      // pixels per cell horizontally, default 5
  rowsPerCell?: number;      // pixels per cell vertically, default 8
  // later you can pass an array of bitmaps, one per cell
  bitmaps?: boolean[][][];   // bitmaps[cellIndex][row][col]
}

export const LcdRow: React.FC<LcdRowProps> = ({
  cells = 16,
  colsPerCell = 5,
  rowsPerCell = 8,
  bitmaps,
}) => {
  return (
    <div className="flex">
      {Array.from({ length: cells }).map((_, i) => (
        <LcdCell
          key={i}
          cols={colsPerCell}
          rows={rowsPerCell}
          bitmap={bitmaps?.[i]}
        />
      ))}
    </div>
  );
};
