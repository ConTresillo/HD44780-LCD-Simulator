import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Glyph, Char } from './Glyph';
export const LCDDisplay = ({ display, glyphs, cursor, cursorVisible, blinkOn }) => {
    const [blinkState, setBlinkState] = useState(true);
    useEffect(() => {
        if (!blinkOn) {
            setBlinkState(true);
            return;
        }
        const interval = setInterval(() => {
            setBlinkState((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, [blinkOn]);
    return (_jsx("div", { style: {
            backgroundColor: '#8ba90e',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)',
            display: 'inline-block',
            border: '4px solid #1a1a1a'
        }, children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '4px' }, children: display.map((row, r) => (_jsx("div", { style: { display: 'flex', gap: '4px' }, children: row.map((byte, c) => {
                    const isCursor = cursorVisible && r === cursor.row && c === cursor.col;
                    if (byte <= 0x07) {
                        return (_jsx(Glyph, { pixels: glyphs[byte], cursor: isCursor, blink: blinkState }, c));
                    }
                    return (_jsx(Char, { value: byte, cursor: isCursor, blink: blinkState }, c));
                }) }, r))) }) }));
};
//# sourceMappingURL=LCDDisplay.js.map