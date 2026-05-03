import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * CheatsheetPanel.tsx — Educational sidebar for LCD commands.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
export const CheatsheetPanel = () => {
    const { theme } = useTheme();
    const { busState } = useLCD();
    const { rs } = busState;
    const section = (title, content) => (_jsxs("div", { style: { marginBottom: 24 }, children: [_jsx("div", { style: {
                    fontSize: 10, color: theme.panel.heading,
                    fontFamily: theme.core.headingFont,
                    letterSpacing: '0.1em', marginBottom: 12,
                    borderBottom: `1px solid ${theme.panel.border}`,
                    paddingBottom: 6,
                }, children: title }), content] }));
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' }, children: [section('CURRENT MODE', (_jsxs("div", { style: {
                    padding: '12px',
                    background: rs ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 122, 255, 0.1)',
                    border: `1px solid ${rs ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 122, 255, 0.3)'}`,
                    borderRadius: 8,
                    textAlign: 'center'
                }, children: [_jsx("div", { style: { fontSize: 9, color: theme.core.muted, marginBottom: 2 }, children: "REGISTER SELECT (RS)" }), _jsx("div", { style: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: rs ? theme.statusBadge.connectedText : theme.core.primary,
                            fontFamily: theme.core.headingFont
                        }, children: rs ? 'DATA MODE (RS=1)' : 'COMMAND MODE (RS=0)' }), _jsx("div", { style: { fontSize: 9, color: theme.core.muted, marginTop: 4 }, children: rs ? 'Writing to DDRAM/CGRAM' : 'Executing Controller Instructions' })] }))), section('COMMAND CHEATSHEET', (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsx(CmdRow, { hex: "01", label: "Clear Display", theme: theme }), _jsx(CmdRow, { hex: "02", label: "Return Home", theme: theme }), _jsx(CmdRow, { hex: "04-07", label: "Entry Mode Set", theme: theme }), _jsx(CmdRow, { hex: "08-0F", label: "Display Control", theme: theme }), _jsx(CmdRow, { hex: "10-1F", label: "Cursor/Display Shift", theme: theme }), _jsx(CmdRow, { hex: "20-3F", label: "Function Set", theme: theme }), _jsx(CmdRow, { hex: "40-7F", label: "Set CGRAM Addr", theme: theme }), _jsx(CmdRow, { hex: "80-FF", label: "Set DDRAM Addr", theme: theme })] }))), _jsxs("div", { style: { marginTop: 'auto', padding: 12, background: theme.panel.background, borderRadius: 8, border: `1px solid ${theme.panel.border}` }, children: [_jsx("div", { style: { fontSize: 10, fontWeight: 'bold', marginBottom: 8, color: theme.panel.heading }, children: "SIGNAL FLOW" }), _jsxs("div", { style: { fontSize: 10, color: theme.core.muted, lineHeight: 1.4 }, children: ["1. Set ", _jsx("b", { children: "RS" }), " and ", _jsx("b", { children: "Data" }), " pins.", _jsx("br", {}), "2. Pulse ", _jsx("b", { children: "EN" }), " (High \u2192 Low).", _jsx("br", {}), "3. LCD latch data on ", _jsx("b", { children: "Falling Edge" }), "."] })] })] }));
};
const CmdRow = ({ hex, label, theme }) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, children: [_jsxs("code", { style: { fontSize: 10, color: theme.core.primary, background: theme.panel.background, padding: '2px 4px', borderRadius: 4 }, children: ["0x", hex] }), _jsx("span", { style: { fontSize: 10, color: theme.core.muted, fontFamily: theme.core.bodyFont }, children: label })] }));
//# sourceMappingURL=CheatsheetPanel.js.map