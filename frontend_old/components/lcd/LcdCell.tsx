import React from "react";
import { LcdArray } from "./LcdArray";

export interface LcdCellProps {
  cols?: number;           // default 5
  rows?: number;           // default 8
  bitmap?: boolean[][];    // bitmap[r][c] → true = lit
}

export const LcdCell: React.FC<LcdCellProps> = ({
  cols = 5,
  rows = 8,
  bitmap,
}) => {
  return (
    <div className="inline-flex flex-col gap-[1px] mx-[3px] my-[4px]">
      {Array.from({ length: rows }).map((_, row) => {
        const rowBits = bitmap?.[row];
        const litIndices =
          rowBits?.reduce<number[]>((acc, lit, idx) => {
            if (lit) acc.push(idx);
            return acc;
          }, []) ?? [];

        return (
          <LcdArray
            key={row}
            length={cols}
            litIndices={litIndices}
          />
        );
      })}
    </div>
  );
};
