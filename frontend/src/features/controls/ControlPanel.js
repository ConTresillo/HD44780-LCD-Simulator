import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ControlPanel.tsx — High-level utility commands and configuration.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { IconButton } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';
const QUICK_COMMANDS = [
    { label: 'Clear Display', byte: 0x01 },
    { label: 'Return Home', byte: 0x02 },
    { label: 'Display ON', byte: 0x0C },
    { label: 'Display OFF', byte: 0x08 },
    { label: 'Set 2-Line', byte: 0x38 },
    { label: 'Set 1-Line', byte: 0x30 },
    { label: 'Init Seq (x3)', byte: 0x30, repeat: 3 },
];
export const ControlPanel = () => {
    const { theme } = useTheme();
    const { sendCommand, reset, updateConfig, hardware } = useLCD();
    const h = hardware;
    // Macro: HD44780 Standard Initialization Sequence (0x30 x3)
    const runInitSequence = async () => {
        // 1st 0x30
        sendCommand(0x30);
        await new Promise(r => setTimeout(r, 100));
        // 2nd 0x30
        sendCommand(0x30);
        await new Promise(r => setTimeout(r, 40));
        // 3rd 0x30
        sendCommand(0x30);
    };
    // Helper to construct Display Control command (0x08 | D | C | B)
    const setDisplayState = (d, c, b) => {
        let byte = 0x08;
        if (d)
            byte |= 0x04;
        if (c)
            byte |= 0x02;
        if (b)
            byte |= 0x01;
        sendCommand(byte);
    };
    const label = (text) => (_jsx("div", { style: {
            fontSize: 10, color: theme.panel.label,
            fontFamily: theme.core.headingFont,
            letterSpacing: '0.1em', marginBottom: 12,
            borderBottom: `1px solid ${theme.panel.border}`,
            paddingBottom: 6,
        }, children: text }));
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 24 }, children: [_jsxs("div", { children: [label('DISPLAY CONTROL'), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsx(IconButton, { label: h?.displayOn ? "DISP: ON" : "DISP: OFF", variant: h?.displayOn ? "success" : "default", onClick: () => setDisplayState(!h?.displayOn, !!h?.cursorOn, !!h?.blinkOn), style: { fontSize: 9 } }), _jsx(IconButton, { label: h?.cursorOn ? "CURS: ON" : "CURS: OFF", variant: h?.cursorOn ? "success" : "default", onClick: () => setDisplayState(!!h?.displayOn, !h?.cursorOn, !!h?.blinkOn), style: { fontSize: 9 } }), _jsx(IconButton, { label: h?.blinkOn ? "BLNK: ON" : "BLNK: OFF", variant: h?.blinkOn ? "success" : "default", onClick: () => setDisplayState(!!h?.displayOn, !!h?.cursorOn, !h?.blinkOn), style: { fontSize: 9 } }), _jsx(IconButton, { label: "CLEAR", onClick: () => sendCommand(0x01), style: { fontSize: 9 } })] })] }), _jsxs("div", { children: [label('SHIFT OPERATIONS'), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsx(IconButton, { label: "CURSOR \u2190", onClick: () => sendCommand(0x10), style: { fontSize: 9 } }), _jsx(IconButton, { label: "CURSOR \u2192", onClick: () => sendCommand(0x14), style: { fontSize: 9 } }), _jsx(IconButton, { label: "DISPLAY \u2190", onClick: () => sendCommand(0x18), style: { fontSize: 9 } }), _jsx(IconButton, { label: "DISPLAY \u2192", onClick: () => sendCommand(0x1C), style: { fontSize: 9 } })] })] }), _jsxs("div", { children: [label('SYSTEM CONTROL'), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsx(IconButton, { label: "HOME", onClick: () => sendCommand(0x02), style: { fontSize: 9 } }), _jsx(IconButton, { label: "RESET", variant: "danger", onClick: reset, style: { fontSize: 9 } })] }), _jsx(IconButton, { label: h?.fastMode ? "TURBO MODE: ON" : "TURBO MODE: OFF", variant: h?.fastMode ? "success" : "default", onClick: () => updateConfig({ fastMode: !h?.fastMode }), style: { width: '100%', fontSize: 9 } }), _jsx(IconButton, { label: "3x INIT SEQUENCE (0x30)", onClick: runInitSequence, variant: "default", style: {
                                    width: '100%',
                                    fontSize: 9,
                                    padding: '10px',
                                    border: `1px solid ${theme.core.primary}44`,
                                    color: theme.core.primary,
                                    background: `${theme.core.primary}08`,
                                    letterSpacing: '0.05em',
                                    marginTop: 4
                                } })] })] })] }));
};
//# sourceMappingURL=ControlPanel.js.map