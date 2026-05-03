import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * StatePanel.tsx — Live hardware state readout.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
export const StatePanel = () => {
    const { theme } = useTheme();
    const { hardware } = useLCD();
    if (!hardware) {
        return (_jsxs("div", { style: panelStyle(theme), children: [_jsx(Label, { theme: theme, children: "HARDWARE STATE" }), _jsx("div", { style: { color: theme.core.muted, fontSize: 12, fontFamily: theme.core.bodyFont }, children: "Waiting for connection\u2026" })] }));
    }
    const h = hardware;
    const rows = [
        ['Address Pointer', `0x${h.addressPointer.toString(16).padStart(2, '0').toUpperCase()} (${h.addressPointer})`],
        ['RAM Mode', h.ramType],
        ['Entry Mode', `${h.entryModeIncrement ? 'INCREMENT' : 'DECREMENT'} / Shift: ${h.entryModeShift ? 'ON' : 'OFF'}`],
        ['Display', `${h.displayOn ? 'ON' : 'OFF'} / Cursor: ${h.cursorOn ? 'ON' : 'OFF'} / Blink: ${h.blinkOn ? 'ON' : 'OFF'}`],
        ['Data Mode', `${h.dataLength}-bit / ${h.numLines}-line / ${h.font}`],
        ['Shift Offset', String(h.shiftOffset)],
        ['Initialized', `${h.initialized} (pulses: ${h.initCount}/3)`],
        ['Busy Flag', h.busyFlag ? '🔴 BUSY' : '🟢 READY'],
        ['RS / RW / EN', `${h.rs ? 1 : 0} / ${h.rw ? 1 : 0} / ${h.en ? 1 : 0}`],
    ];
    return (_jsxs("div", { style: panelStyle(theme), children: [_jsx(Label, { theme: theme, children: "HARDWARE STATE" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 6 }, children: rows.map(([key, val]) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: 8 }, children: [_jsx("span", { style: { color: theme.panel.label, fontSize: 11, fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap' }, children: key }), _jsx("span", { style: { color: theme.core.primary, fontSize: 11, fontFamily: theme.core.bodyFont, textAlign: 'right' }, children: val })] }, key))) }), _jsxs("div", { style: { marginTop: 16 }, children: [_jsx("div", { style: { fontSize: 10, color: theme.panel.label, fontFamily: theme.core.headingFont, letterSpacing: '0.08em', marginBottom: 6 }, children: "DDRAM ROWS" }), _jsx(DdramRow, { label: "Row 1 (0x00)", bytes: h.ddram.slice(0x00, 0x10), theme: theme }), _jsx(DdramRow, { label: "Row 2 (0x40)", bytes: h.ddram.slice(0x40, 0x50), theme: theme })] })] }));
};
const DdramRow = ({ label, bytes, theme }) => (_jsxs("div", { style: { marginBottom: 8 }, children: [_jsx("div", { style: { fontSize: 9, color: theme.panel.label, fontFamily: theme.core.bodyFont, marginBottom: 3 }, children: label }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 3 }, children: bytes.map((b, i) => (_jsx("span", { style: {
                    fontSize: 9, fontFamily: theme.core.bodyFont,
                    color: b === 0x20 ? theme.core.muted : theme.panel.heading,
                    background: theme.panel.background,
                    border: `1px solid ${theme.panel.border}`,
                    borderRadius: 3, padding: '1px 4px',
                }, children: b.toString(16).padStart(2, '0').toUpperCase() }, i))) })] }));
const panelStyle = (theme) => ({
    background: theme.panel.background,
    border: `1px solid ${theme.panel.border}`,
    borderRadius: 12, padding: 20,
    display: 'flex', flexDirection: 'column', gap: 12,
});
const Label = ({ theme, children }) => (_jsx("div", { style: {
        fontSize: 10, color: theme.panel.heading,
        fontFamily: theme.core.headingFont, letterSpacing: '0.1em',
        borderBottom: `1px solid ${theme.panel.border}`, paddingBottom: 8,
    }, children: children }));
//# sourceMappingURL=StatePanel.js.map