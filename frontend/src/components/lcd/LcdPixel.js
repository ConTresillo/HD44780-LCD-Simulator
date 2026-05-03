import { jsx as _jsx } from "react/jsx-runtime";
/**
 * LcdPixel.tsx — Single 5×8 pixel dot on the LCD.
 * Design inherited from frontend_old: glow effect when lit.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
export const LcdPixel = ({ lit }) => {
    const { theme } = useTheme();
    return (_jsx("div", { style: {
            width: 4,
            height: 4,
            borderRadius: 1,
            backgroundColor: lit ? theme.lcd.pixelOn : theme.lcd.pixelOff,
            boxShadow: lit ? `0 0 5px ${theme.lcd.pixelOn}, 0 0 2px ${theme.lcd.pixelOn}` : 'none',
            transition: 'background-color 40ms, box-shadow 40ms',
        } }));
};
//# sourceMappingURL=LcdPixel.js.map