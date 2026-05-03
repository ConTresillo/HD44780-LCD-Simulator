import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const Glyph = ({ pixels, cursor, blink }) => {
    const showCursor = cursor && blink;
    return (_jsx("div", { style: {
            display: 'grid',
            gridTemplateRows: 'repeat(8, 1fr)',
            gridTemplateColumns: 'repeat(5, 1fr)',
            width: '18px',
            height: '28px',
            gap: '1px',
            padding: '2px',
            backgroundColor: showCursor ? 'rgba(26, 31, 2, 0.4)' : 'transparent',
            borderRadius: '1px',
        }, children: pixels.map((row, r) => row.map((bit, c) => (_jsx("div", { style: {
                backgroundColor: bit === 1 ? '#1a1f02' : 'rgba(26, 31, 2, 0.05)',
                borderRadius: '0.5px'
            } }, `${r}-${c}`)))) }));
};
export const Char = ({ value, cursor, blink }) => {
    const showCursor = cursor && blink;
    const char = value >= 32 ? String.fromCharCode(value) : ' ';
    return (_jsx("div", { style: {
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
        }, children: char }));
};
//# sourceMappingURL=Glyph.js.map