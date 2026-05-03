/**
 * LcdDisplay.tsx — Full LCD panel with bezel, glass, and pixel matrix.
 * Renders from view.display (rows × cols of char codes) + view.glyphs (CGRAM).
 * Design language inherited from frontend_old LcdWindow + bezel styling.
 */
import React, { useMemo } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { LcdCell } from './LcdCell';
import type { LCDView } from '../../services/api.types';

// ── Simplified ROM — maps charCode to 5×8 bitmap ─────────────────────────────
// Real ROM has 256 entries; this covers printable ASCII with a minimal pattern.
export function charToBitmap(code: number): number[][] {
  if (code === 0x20 || code === 0x00) return Array(8).fill(Array(5).fill(0));

  // Encode each character as 8 rows of 5 bits, stored as numbers
  const map: Record<number, number[]> = {
    // A
    0x41: [0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b00000,0b00000],
    0x42: [0b11110,0b10001,0b11110,0b10001,0b10001,0b11110,0b00000,0b00000],
    0x43: [0b01110,0b10001,0b10000,0b10000,0b10001,0b01110,0b00000,0b00000],
    0x44: [0b11100,0b10010,0b10001,0b10001,0b10010,0b11100,0b00000,0b00000],
    0x45: [0b11111,0b10000,0b11110,0b10000,0b10000,0b11111,0b00000,0b00000],
    0x46: [0b11111,0b10000,0b11110,0b10000,0b10000,0b10000,0b00000,0b00000],
    0x47: [0b01110,0b10001,0b10000,0b10011,0b10001,0b01110,0b00000,0b00000],
    0x48: [0b10001,0b10001,0b11111,0b10001,0b10001,0b10001,0b00000,0b00000],
    0x49: [0b01110,0b00100,0b00100,0b00100,0b00100,0b01110,0b00000,0b00000],
    0x4A: [0b00111,0b00010,0b00010,0b10010,0b10010,0b01100,0b00000,0b00000],
    0x4B: [0b10001,0b10010,0b11100,0b10010,0b10001,0b10001,0b00000,0b00000],
    0x4C: [0b10000,0b10000,0b10000,0b10000,0b10000,0b11111,0b00000,0b00000],
    0x4D: [0b10001,0b11011,0b10101,0b10001,0b10001,0b10001,0b00000,0b00000],
    0x4E: [0b10001,0b11001,0b10101,0b10011,0b10001,0b10001,0b00000,0b00000],
    0x4F: [0b01110,0b10001,0b10001,0b10001,0b10001,0b01110,0b00000,0b00000],
    0x50: [0b11110,0b10001,0b11110,0b10000,0b10000,0b10000,0b00000,0b00000],
    0x51: [0b01110,0b10001,0b10001,0b10101,0b10010,0b01101,0b00000,0b00000],
    0x52: [0b11110,0b10001,0b11110,0b10100,0b10010,0b10001,0b00000,0b00000],
    0x53: [0b01111,0b10000,0b01110,0b00001,0b00001,0b11110,0b00000,0b00000],
    0x54: [0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00000,0b00000],
    0x55: [0b10001,0b10001,0b10001,0b10001,0b10001,0b01110,0b00000,0b00000],
    0x56: [0b10001,0b10001,0b10001,0b10001,0b01010,0b00100,0b00000,0b00000],
    0x57: [0b10001,0b10001,0b10101,0b10101,0b10101,0b01010,0b00000,0b00000],
    0x58: [0b10001,0b01010,0b00100,0b00100,0b01010,0b10001,0b00000,0b00000],
    0x59: [0b10001,0b01010,0b00100,0b00100,0b00100,0b00100,0b00000,0b00000],
    0x5A: [0b11111,0b00010,0b00100,0b01000,0b10000,0b11111,0b00000,0b00000],
    // lowercase
    0x61: [0b00000,0b00000,0b01110,0b00001,0b01111,0b10001,0b01111,0b00000],
    0x62: [0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b11110,0b00000],
    0x63: [0b00000,0b00000,0b01110,0b10000,0b10000,0b10001,0b01110,0b00000],
    0x64: [0b00001,0b00001,0b01111,0b10001,0b10001,0b10001,0b01111,0b00000],
    0x65: [0b00000,0b01110,0b10001,0b11111,0b10000,0b10001,0b01110,0b00000],
    0x66: [0b00110,0b01001,0b01000,0b11110,0b01000,0b01000,0b01000,0b00000],
    0x67: [0b00000,0b01111,0b10001,0b01111,0b00001,0b10001,0b01110,0b00000],
    0x68: [0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b10001,0b00000],
    0x69: [0b00100,0b00000,0b01100,0b00100,0b00100,0b00100,0b01110,0b00000],
    0x6A: [0b00010,0b00000,0b00110,0b00010,0b00010,0b10010,0b01100,0b00000],
    0x6B: [0b10000,0b10000,0b10010,0b10100,0b11000,0b10100,0b10010,0b00000],
    0x6C: [0b01100,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110,0b00000],
    0x6D: [0b00000,0b00000,0b11010,0b10101,0b10101,0b10001,0b10001,0b00000],
    0x6E: [0b00000,0b00000,0b11110,0b10001,0b10001,0b10001,0b10001,0b00000],
    0x6F: [0b00000,0b00000,0b01110,0b10001,0b10001,0b10001,0b01110,0b00000],
    0x70: [0b00000,0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b00000],
    0x71: [0b00000,0b01111,0b10001,0b10001,0b01111,0b00001,0b00001,0b00000],
    0x72: [0b00000,0b00000,0b10110,0b11001,0b10000,0b10000,0b10000,0b00000],
    0x73: [0b00000,0b00000,0b01110,0b10000,0b01110,0b00001,0b11110,0b00000],
    0x74: [0b01000,0b01000,0b11110,0b01000,0b01000,0b01001,0b00110,0b00000],
    0x75: [0b00000,0b00000,0b10001,0b10001,0b10001,0b10011,0b01101,0b00000],
    0x76: [0b00000,0b00000,0b10001,0b10001,0b10001,0b01010,0b00100,0b00000],
    0x77: [0b00000,0b00000,0b10001,0b10001,0b10101,0b10101,0b01010,0b00000],
    0x78: [0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001,0b00000],
    0x79: [0b00000,0b10001,0b10001,0b01111,0b00001,0b10001,0b01110,0b00000],
    0x7A: [0b00000,0b00000,0b11111,0b00010,0b00100,0b01000,0b11111,0b00000],
    // digits
    0x30: [0b01110,0b10001,0b10011,0b10101,0b11001,0b10001,0b01110,0b00000],
    0x31: [0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110,0b00000],
    0x32: [0b01110,0b10001,0b00001,0b00110,0b01000,0b10000,0b11111,0b00000],
    0x33: [0b11111,0b00010,0b00100,0b00010,0b00001,0b10001,0b01110,0b00000],
    0x34: [0b00010,0b00110,0b01010,0b10010,0b11111,0b00010,0b00010,0b00000],
    0x35: [0b11111,0b10000,0b11110,0b00001,0b00001,0b10001,0b01110,0b00000],
    0x36: [0b00110,0b01000,0b10000,0b11110,0b10001,0b10001,0b01110,0b00000],
    0x37: [0b11111,0b00001,0b00010,0b00100,0b01000,0b01000,0b01000,0b00000],
    0x38: [0b01110,0b10001,0b10001,0b01110,0b10001,0b10001,0b01110,0b00000],
    0x39: [0b01110,0b10001,0b10001,0b01111,0b00001,0b00010,0b01100,0b00000],
    // punctuation
    0x21: [0b00100,0b00100,0b00100,0b00100,0b00000,0b00000,0b00100,0b00000],
    0x2E: [0b00000,0b00000,0b00000,0b00000,0b00000,0b00000,0b00100,0b00000],
    0x2C: [0b00000,0b00000,0b00000,0b00000,0b00000,0b00100,0b00100,0b01000],
    0x3A: [0b00000,0b00100,0b00000,0b00000,0b00100,0b00000,0b00000,0b00000],
    0x3F: [0b01110,0b10001,0b00001,0b00110,0b00100,0b00000,0b00100,0b00000],
    0x2D: [0b00000,0b00000,0b00000,0b11111,0b00000,0b00000,0b00000,0b00000],
    0x3D: [0b00000,0b00000,0b11111,0b00000,0b11111,0b00000,0b00000,0b00000],
    0x2B: [0b00000,0b00100,0b00100,0b11111,0b00100,0b00100,0b00000,0b00000],
    0x2F: [0b00001,0b00010,0b00100,0b01000,0b10000,0b00000,0b00000,0b00000],
  };

  const rows = map[code];
  if (!rows) {
    // Unknown — draw a box
    return [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1],
      [0,0,0,0,0],
    ];
  }
  return rows.map(row => [4,3,2,1,0].map(bit => (row >> bit) & 1));
}

interface Props {
  view: LCDView;
  blinkOn: boolean;
  hardware?: any;
}

export const LcdDisplay: React.FC<Props> = ({ view, blinkOn, hardware }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        background: theme.lcd.bezel,
        border: `3px solid ${theme.lcd.bezelBorder}`,
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: theme.lcd.bezelShadow,
        position: 'relative',
        minWidth: view.cols * 26 + 32, 
      }}
    >
      {/* HOVER OVERLAY: Internal State */}
      {isHovered && hardware && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)', left: '50%',
          transform: 'translateX(-50%)',
          background: theme.diagnostic.background,
          color: theme.diagnostic.text,
          padding: '16px 24px',
          borderRadius: 12,
          fontSize: 10,
          fontFamily: theme.core.bodyFont,
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: theme.diagnostic.shadow,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 32px',
          border: `1px solid ${theme.diagnostic.border}`,
          backdropFilter: 'blur(10px)'
        }}>
          {/* Addressing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: theme.diagnostic.label, fontWeight: 'bold', fontSize: 8 }}>ADDRESSING</div>
            <div>Pointer: <span style={{ color: theme.diagnostic.value }}>0x{hardware.addressPointer.toString(16).toUpperCase()}</span></div>
            <div>RAM: <span style={{ color: theme.diagnostic.value }}>{hardware.ramType}</span></div>
          </div>

          {/* Display Flags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: theme.diagnostic.label, fontWeight: 'bold', fontSize: 8 }}>DISPLAY FLAGS</div>
            <div>Display: <span style={{ color: theme.diagnostic.value }}>{hardware.displayOn ? 'ON' : 'OFF'}</span></div>
            <div>Cursor: <span style={{ color: theme.diagnostic.value }}>{hardware.cursorOn ? 'ON' : 'OFF'}</span> / <span style={{ color: theme.diagnostic.value }}>{hardware.blinkOn ? 'BLINK' : 'STATIC'}</span></div>
          </div>

          {/* Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: theme.diagnostic.label, fontWeight: 'bold', fontSize: 8 }}>MODE</div>
            <div>Entry: <span style={{ color: theme.diagnostic.value }}>{hardware.entryModeIncrement ? 'INC' : 'DEC'}</span></div>
            <div>Bus: <span style={{ color: theme.diagnostic.value }}>{hardware.dataLength}-bit</span></div>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: theme.diagnostic.label, fontWeight: 'bold', fontSize: 8 }}>STATUS</div>
            <div>Busy: <span style={{ color: hardware.busyFlag ? theme.log.errorColor : theme.statusBadge.readyText, fontWeight: 'bold' }}>{hardware.busyFlag ? 'BUSY' : 'READY'}</span></div>
            <div>Inited: <span style={{ color: theme.diagnostic.value }}>{hardware.initialized ? 'YES' : 'NO'}</span></div>
          </div>
        </div>
      )}
      {/* Screen glass */}
      <div
        style={{
          background: theme.lcd.glass,
          borderRadius: 4,
          padding: '8px 4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {view.display.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((charCode, c) => {
              const isAtCursor = view.cursor.row === r && view.cursor.col === c;
              const isCursor = isAtCursor && view.cursorVisible; // Underline
              const isBlinking = isAtCursor && blinkOn;         // Block Blink
              
              const bitmap = charCode >= 0x00 && charCode <= 0x07
                ? view.glyphs[charCode] ?? charToBitmap(charCode)
                : charToBitmap(charCode);
              return (
                <LcdCell
                  key={c}
                  bitmap={bitmap}
                  isCursor={isCursor}
                  isBlinking={isBlinking}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
