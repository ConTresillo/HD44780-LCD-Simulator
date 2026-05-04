/**
 * LcdDisplay.tsx — High-fidelity physical LCD rendering.
 * Simulates a dot-matrix display with hardware-accurate font mapping.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
import { charToBitmap } from './fontRom';

export const LcdDisplay: React.FC = () => {
  const { theme } = useTheme();
  const { view } = useLCD();

  if (!view) return <div style={{ color: theme.core.muted }}>Connecting...</div>;

  const { rows, cols, display, cursor, glyphs, cursorOn, blinkOn } = view;

  return (
    <div style={{
      background: theme.lcd.bezel,
      padding: 30,
      borderRadius: 12,
      border: `2px solid ${theme.lcd.bezelBorder}`,
      boxShadow: theme.lcd.bezelShadow,
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 12
    }}>
      {/* Glass Surface */}
      <div style={{
        background: theme.lcd.glass,
        padding: 16,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
      }}>
        {display.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: 6 }}>
            {row.map((charCode, c) => {
              const isCursor = cursor.row === r && cursor.col === c;
              
              // HD44780 Logic: codes 0-7 and 8-15 map to CGRAM 0-7
              const cgramIndex = (charCode >= 0x00 && charCode <= 0x07) 
                ? charCode 
                : (charCode >= 0x08 && charCode <= 0x0F) 
                ? (charCode - 0x08) 
                : null;

              const bitmap = (cgramIndex !== null && glyphs && glyphs[cgramIndex])
                ? glyphs[cgramIndex]
                : charToBitmap(charCode);

              return (
                <LcdCell
                  key={c}
                  bitmap={bitmap}
                  showCursor={isCursor && cursorOn}
                  showBlink={isCursor && cursorOn && blinkOn}
                  theme={theme}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const LcdCell: React.FC<{
  bitmap: number[][];
  showCursor: boolean;
  showBlink: boolean;
  theme: any;
}> = ({ bitmap, showCursor, showBlink, theme }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      position: 'relative'
    }}>
      <style>{`
        @keyframes lcd-blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
      
      {bitmap.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: 'flex', gap: 1 }}>
          {row.map((val, colIdx) => {
            // Hardware Cursor: Light up the bottom-most row of the dot matrix
            const isCursorRow = showCursor && rowIdx === bitmap.length - 1;
            const isPixelOn = val || isCursorRow;

            return (
              <div
                key={colIdx}
                style={{
                  width: 4,
                  height: 4,
                  background: isPixelOn ? theme.lcd.pixelOn : theme.lcd.pixelOff,
                  borderRadius: 0.5,
                  transition: 'background 50ms',
                  boxShadow: isPixelOn ? `0 0 2px ${theme.lcd.pixelOn}44` : 'none'
                }}
              />
            );
          })}
        </div>
      ))}
      
      {/* Blinking Block Cursor */}
      {showBlink && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.lcd.pixelOn,
          opacity: 0.6,
          animation: 'lcd-blink 0.8s infinite step-start',
          pointerEvents: 'none',
          zIndex: 5
        }} />
      )}
    </div>
  );
};
