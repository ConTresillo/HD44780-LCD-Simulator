import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InterpreterPanel.tsx — Live command decoder and character preview.
 * Switches mode based on RS pin state.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
import { LcdCell } from '../../components/lcd/LcdCell';
import { charToBitmap } from '../../components/lcd/LcdDisplay';
const COMMAND_DB = [
    { name: "Clear Display", mask: 0xFF, value: 0x01, group: "System" },
    { name: "Return Home", mask: 0xFF, value: 0x02, group: "System" },
    { name: "Entry Mode Set", mask: 0xFC, value: 0x04, group: "Entry", params: ["I/D", "S"] },
    { name: "Display Control", mask: 0xF8, value: 0x08, group: "Display", params: ["D", "C", "B"] },
    { name: "Cursor/Display Shift", mask: 0xF0, value: 0x10, group: "Shift", params: ["S/C", "R/L"] },
    { name: "Function Set", mask: 0xE0, value: 0x20, group: "Function", params: ["DL", "N", "F"] },
    { name: "Set CGRAM Addr", mask: 0xC0, value: 0x40, group: "Address" },
    { name: "Set DDRAM Addr", mask: 0x80, value: 0x80, group: "Address" }
];
// Binary bit visualization helper
const BitDisplay = ({ value, theme }) => (_jsx("div", { style: { display: 'flex', gap: 4, marginBottom: 16, justifyContent: 'center' }, children: [7, 6, 5, 4, 3, 2, 1, 0].map(i => (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }, children: [_jsx("div", { style: {
                    width: 20, height: 24,
                    background: (value >> i) & 1 ? theme.core.primary : theme.panel.background,
                    color: (value >> i) & 1 ? '#fff' : theme.core.muted,
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 'bold',
                    border: `1px solid ${theme.panel.border}`
                }, children: (value >> i) & 1 }), _jsxs("div", { style: { fontSize: 8, color: theme.core.muted }, children: ["b", i] })] }, i))) }));
export const InterpreterPanel = () => {
    const { theme } = useTheme();
    const { busState } = useLCD();
    if (!busState)
        return null;
    const { data, rs } = busState;
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 16, height: '100%', minWidth: 200 }, children: [_jsxs("div", { style: {
                    padding: '12px',
                    background: theme.core.surfaceAlt,
                    border: `1px solid ${theme.panel.border}`,
                    borderRadius: 12,
                    textAlign: 'center',
                    boxShadow: rs ? `0 0 15px ${theme.dataPin.activeBorder}33` : 'none',
                    transition: 'all 300ms ease'
                }, children: [_jsx("div", { style: {
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: theme.core.primary,
                            fontFamily: theme.core.headingFont,
                            letterSpacing: '0.1em'
                        }, children: rs ? 'DATA MODE (WRITE)' : 'COMMAND MODE (INSTR)' }), _jsxs("div", { style: { fontSize: 9, color: theme.core.muted, marginTop: 4, fontFamily: theme.core.bodyFont, opacity: 0.8 }, children: ["PIN RS = ", _jsx("span", { style: { color: rs ? theme.dataPin.activeBorder : theme.core.muted }, children: rs ? 'HIGH' : 'LOW' })] })] }), _jsx(BitDisplay, { value: data, theme: theme }), _jsx("div", { style: { flex: 1, overflowY: 'auto' }, children: rs ? (_jsx(DataPreview, { data: data, theme: theme })) : (_jsx(CommandDecoder, { data: data, theme: theme })) }), _jsxs("div", { style: {
                    padding: 12,
                    background: theme.core.background,
                    borderRadius: 10,
                    border: `1px solid ${theme.panel.border}`
                }, children: [_jsx("div", { style: { fontSize: 8, fontWeight: 'bold', marginBottom: 8, color: theme.panel.label, letterSpacing: '0.1em' }, children: "HARDWARE SIGNALS" }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.core.muted, fontFamily: theme.core.bodyFont }, children: [_jsxs("span", { children: ["RS: ", rs ? 'H' : 'L'] }), _jsxs("span", { children: ["RW: ", busState.rw ? 'R' : 'W'] }), _jsxs("span", { children: ["EN: ", busState.en ? 'H' : 'L'] })] })] })] }));
};
const CommandDecoder = ({ data, theme }) => {
    const matches = COMMAND_DB.filter(cmd => (data & cmd.mask) === cmd.value);
    const matched = matches[0];
    if (!matched) {
        return (_jsxs("div", { style: {
                background: theme.core.background,
                padding: 20, borderRadius: 12, border: `1px solid ${theme.log.errorColor}33`,
                textAlign: 'center'
            }, children: [_jsxs("div", { style: { fontSize: 11, fontWeight: 'bold', color: theme.log.errorColor, marginBottom: 4 }, children: ["Unknown 0x", data.toString(16).toUpperCase()] }), _jsx("div", { style: { fontSize: 9, color: theme.core.muted }, children: "Check bit pattern." })] }));
    }
    const related = COMMAND_DB.filter(c => c.group === matched.group && c.name !== matched.name);
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: [_jsxs("div", { style: { background: theme.panel.background, padding: 16, borderRadius: 12, border: `1px solid ${theme.panel.border}` }, children: [_jsx("div", { style: { fontSize: 9, color: theme.panel.label, marginBottom: 8, letterSpacing: '0.05em' }, children: matched.group.toUpperCase() }), _jsx("div", { style: { fontSize: 15, fontWeight: 'bold', color: theme.core.primary, marginBottom: 12, fontFamily: theme.core.headingFont }, children: matched.name }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: matched.params?.map(p => {
                            const { bit, desc } = getParamDetail(matched.name, p, data);
                            return (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10, alignItems: 'center' }, children: [_jsxs("span", { style: { color: theme.panel.label }, children: ["Bit ", bit, " (", p, ")"] }), _jsx("span", { style: { color: theme.core.primary, fontWeight: 'bold' }, children: desc })] }, p));
                        }) })] }), related.length > 0 && (_jsxs("div", { style: { padding: '4px' }, children: [_jsx("div", { style: { fontSize: 8, color: theme.panel.label, marginBottom: 8, letterSpacing: '0.05em' }, children: "SIMILAR COMMANDS" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: related.slice(0, 3).map(r => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.core.muted }, children: [_jsx("span", { children: r.name }), _jsxs("span", { children: ["0x", r.value.toString(16).toUpperCase()] })] }, r.name))) })] }))] }));
};
const DataPreview = ({ data, theme }) => {
    const char = data >= 32 && data <= 126 ? String.fromCharCode(data) : ' ';
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsxs("div", { style: {
                    background: theme.lcd.glass,
                    padding: '24px',
                    borderRadius: 14,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                    border: `1px solid ${theme.panel.border}`,
                    position: 'relative',
                    boxShadow: `inset 0 0 20px ${theme.lcd.pixelOff}22`
                }, children: [_jsx("div", { style: { fontSize: 8, color: theme.panel.label, fontWeight: 'bold', fontFamily: theme.core.headingFont, letterSpacing: '0.1em', opacity: 0.7 }, children: "CELL PREVIEW (5x8)" }), _jsx("div", { style: { transform: 'scale(2.5)', margin: '10px 0' }, children: _jsx(LcdCell, { bitmap: charToBitmap(data) }) }), _jsxs("div", { style: { fontSize: 18, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.headingFont }, children: ["'", char, "'"] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("div", { style: { background: theme.core.background, padding: 14, borderRadius: 12, border: `1px solid ${theme.panel.border}`, textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 9, color: theme.core.muted, fontWeight: 'bold', marginBottom: 4 }, children: "HEX" }), _jsxs("div", { style: { fontSize: 16, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.bodyFont }, children: ["0x", data.toString(16).toUpperCase().padStart(2, '0')] })] }), _jsxs("div", { style: { background: theme.core.background, padding: 14, borderRadius: 12, border: `1px solid ${theme.panel.border}`, textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 9, color: theme.core.muted, fontWeight: 'bold', marginBottom: 4 }, children: "DEC" }), _jsx("div", { style: { fontSize: 16, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.bodyFont }, children: data })] })] }), _jsxs("div", { style: { background: theme.panel.background, padding: 16, borderRadius: 12, border: `1px solid ${theme.panel.border}` }, children: [_jsx("div", { style: { fontSize: 10, fontWeight: 'bold', color: theme.panel.label, marginBottom: 12, letterSpacing: '0.05em', fontFamily: theme.core.headingFont }, children: "ASCII QUICK REF" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 11, color: theme.core.muted, fontFamily: theme.core.bodyFont }, children: [
                            ['A', '0x41'], ['a', '0x61'],
                            ['B', '0x42'], ['b', '0x62'],
                            ['0', '0x30'], ['1', '0x31']
                        ].map(([c, h]) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.panel.border}44`, paddingBottom: 2 }, children: [_jsx("span", { children: c }), " ", _jsx("span", { style: { color: theme.core.primary, fontWeight: 'bold' }, children: h })] }, c))) })] })] }));
};
function getParamDetail(cmd, param, byte) {
    const b = byte || 0;
    if (cmd === "Entry Mode Set") {
        if (param === "I/D")
            return { bit: 1, desc: (b & 0x02) ? "Increment" : "Decrement" };
        if (param === "S")
            return { bit: 0, desc: (b & 0x01) ? "Shift ON" : "Shift OFF" };
    }
    if (cmd === "Display Control") {
        if (param === "D")
            return { bit: 2, desc: (b & 0x04) ? "Display ON" : "Display OFF" };
        if (param === "C")
            return { bit: 1, desc: (b & 0x02) ? "Cursor ON" : "Cursor OFF" };
        if (param === "B")
            return { bit: 0, desc: (b & 0x01) ? "Blink ON" : "Blink OFF" };
    }
    if (cmd === "Cursor/Display Shift") {
        if (param === "S/C")
            return { bit: 3, desc: (b & 0x08) ? "Display Shift" : "Cursor Move" };
        if (param === "R/L")
            return { bit: 2, desc: (b & 0x04) ? "Right" : "Left" };
    }
    if (cmd === "Function Set") {
        if (param === "DL")
            return { bit: 4, desc: (b & 0x10) ? "8-bit" : "4-bit" };
        if (param === "N")
            return { bit: 3, desc: (b & 0x08) ? "2-line" : "1-line" };
        if (param === "F")
            return { bit: 2, desc: (b & 0x04) ? "5x10" : "5x8" };
    }
    return { bit: -1, desc: "-" };
}
//# sourceMappingURL=InterpreterPanel.js.map