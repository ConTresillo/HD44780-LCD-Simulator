/**
 * LcdCell.tsx — One character cell (5 columns × 8 rows of pixels).
 */
import React from 'react';
import { LcdPixel } from './LcdPixel';

interface Props {
  bitmap: number[][];   // [row][col] → 0|1
  isCursor?: boolean;
  isBlinking?: boolean;
}

export const LcdCell: React.FC<Props> = ({ bitmap, isCursor, isBlinking }) => {
  return (
    <div
      className={isBlinking ? 'lcd-blink' : ''}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 1,
        margin: '4px 3px',
        position: 'relative'
      }}
    >
      <style>{`
        @keyframes lcdBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
        .lcd-blink {
          animation: lcdBlink 1s step-start infinite;
        }
      `}</style>
      {bitmap.map((row, r) => (
        <div key={r} style={{ display: 'flex', gap: 2 }}>
          {row.map((lit, c) => {
            // The 8th row (index 7) is the underline cursor
            const isUnderline = isCursor && r === 7;
            return (
              <LcdPixel 
                key={c} 
                lit={lit === 1 || isUnderline} 
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
