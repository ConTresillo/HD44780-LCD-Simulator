import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * LcdCell.tsx — One character cell (5 columns × 8 rows of pixels).
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { LcdPixel } from './LcdPixel';
export const LcdCell = ({ bitmap, isCursor, isBlinking }) => {
    const { theme } = useTheme();
    return (_jsxs("div", { className: isBlinking ? 'lcd-blink' : '', style: {
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 1,
            margin: '2px',
            padding: '4px',
            background: 'rgba(0,0,0,0.05)',
            border: `1px solid ${theme.lcd.bezelBorder}33`,
            borderRadius: 2,
            position: 'relative',
            boxSizing: 'border-box'
        }, children: [_jsx("style", { children: `
        @keyframes lcdBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
        .lcd-blink {
          animation: lcdBlink 1s step-start infinite;
        }
      ` }), bitmap.map((row, r) => (_jsx("div", { style: { display: 'flex', gap: 2 }, children: row.map((lit, c) => {
                    // The 8th row (index 7) is the underline cursor
                    const isUnderline = isCursor && r === 7;
                    return (_jsx(LcdPixel, { lit: lit === 1 || isUnderline }, c));
                }) }, r)))] }));
};
//# sourceMappingURL=LcdCell.js.map