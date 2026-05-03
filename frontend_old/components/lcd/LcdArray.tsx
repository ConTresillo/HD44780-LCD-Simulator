import React from "react";
import { LcdPixel } from "./LcdPixel";

export interface LcdArrayProps {
  length?: number;        // default 5
  litIndices?: number[];  // which pixels are on
}

export const LcdArray: React.FC<LcdArrayProps> = ({
  length = 5,
  litIndices = [],
}) => {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length }).map((_, i) => (
        <LcdPixel key={i} lit={litIndices.includes(i)} />
      ))}
    </div>
  );
};
