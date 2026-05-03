import React from 'react';

interface GlyphProps {
  pixels: number[][]; // 8 rows, 5 cols
  cursor: boolean;
  blink: boolean;
}

export const Glyph: React.FC<GlyphProps> = ({ pixels, cursor, blink }) => {
  const showCursor = cursor && blink;

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: 'repeat(8, 1fr)',
      gridTemplateColumns: 'repeat(5, 1fr)',
      width: '18px',
      height: '28px',
      gap: '1px',
      padding: '2px',
      backgroundColor: showCursor ? 'rgba(26, 31, 2, 0.4)' : 'transparent',
      borderRadius: '1px',
    }}>
      {pixels.map((row, r) => 
        row.map((bit, c) => (
          <div 
            key={`${r}-${c}`} 
            style={{
              backgroundColor: bit === 1 ? '#1a1f02' : 'rgba(26, 31, 2, 0.05)',
              borderRadius: '0.5px'
            }} 
          />
        ))
      )}
    </div>
  );
};

interface CharProps {
  value: number;
  cursor: boolean;
  blink: boolean;
}

export const Char: React.FC<CharProps> = ({ value, cursor, blink }) => {
  const showCursor = cursor && blink;
  const char = value >= 32 ? String.fromCharCode(value) : ' ';

  return (
    <div style={{
      width: '18px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1a1f02',
      position: 'relative',
      backgroundColor: showCursor ? 'rgba(26, 31, 2, 0.4)' : 'transparent',
    }}>
      {char}
      {/* Optional: underline cursor style can be added here if needed */}
    </div>
  );
};
