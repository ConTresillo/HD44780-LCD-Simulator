import React, { useState, useEffect } from 'react';
import { Glyph, Char } from './Glyph';

interface LCDDisplayProps {
  display: number[][];
  glyphs: number[][][];
  cursor: { row: number; col: number };
  cursorVisible: boolean;
  blinkOn: boolean;
}

export const LCDDisplay: React.FC<LCDDisplayProps> = ({ 
  display, 
  glyphs, 
  cursor, 
  cursorVisible, 
  blinkOn 
}) => {
  const [blinkState, setBlinkState] = useState(true);

  useEffect(() => {
    if (!blinkOn) {
      setBlinkState(true);
      return;
    }

    const interval = setInterval(() => {
      setBlinkState((prev: boolean) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [blinkOn]);

  return (
    <div style={{
      backgroundColor: '#8ba90e',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)',
      display: 'inline-block',
      border: '4px solid #1a1a1a'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {display.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '4px' }}>
            {row.map((byte, c) => {
              const isCursor = cursorVisible && r === cursor.row && c === cursor.col;
              
              if (byte <= 0x07) {
                return (
                  <Glyph 
                    key={c} 
                    pixels={glyphs[byte]} 
                    cursor={isCursor} 
                    blink={blinkState} 
                  />
                );
              }

              return (
                <Char 
                  key={c} 
                  value={byte} 
                  cursor={isCursor} 
                  blink={blinkState} 
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
