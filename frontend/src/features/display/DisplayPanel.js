import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * DisplayPanel.tsx — The central LCD view panel.
 * Shows the pixel LCD + hardware state badges.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { LcdDisplay } from '../../components/lcd/LcdDisplay';
import { DataPin, PulseButton, TextInput } from '../../components/controls';
import { GpioPanel } from '../controls/GpioPanel';
import { useLCD } from '../../hooks/useLCD';
const BusBit = ({ bit, data, onToggle, theme }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const isActive = (data >> bit) & 1;
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }, children: [_jsx("button", { onClick: () => onToggle(bit), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), style: {
                    width: 24, height: 28,
                    background: isActive ? theme.dataPin.activeBorder : isHovered ? theme.dataPin.hoverBorder || theme.dataPin.inactiveBg : theme.dataPin.inactiveBg,
                    color: isActive ? theme.dataPin.activeText : isHovered ? theme.dataPin.hoverText || theme.dataPin.inactiveText : theme.dataPin.inactiveText,
                    border: `1px solid ${isActive ? theme.dataPin.activeBorder : isHovered ? theme.dataPin.hoverBorder || theme.dataPin.inactiveBorder : theme.dataPin.inactiveBorder}`,
                    borderRadius: 4,
                    fontSize: 11, fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    boxShadow: isActive ? theme.dataPin.activeShadow : isHovered ? `0 0 8px ${theme.dataPin.activeBorder}40` : 'none',
                    transform: isActive ? 'scale(1.08)' : isHovered ? 'scale(1.15)' : 'scale(1)',
                    fontFamily: theme.core.bodyFont,
                    zIndex: isHovered ? 10 : 1
                }, children: isActive }), _jsxs("span", { style: { fontSize: 8, fontWeight: 'bold', color: theme.core.muted }, children: ["D", bit] })] }));
};
// ── Sub-component for Manual Bus Injection ──────────────────────────────────
const BusInput = ({ data, onUpdate, theme }) => {
    const [mode, setMode] = React.useState('HEX');
    const [localVal, setLocalVal] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    // Sync local value from data bus ONLY when NOT focused
    React.useEffect(() => {
        if (!isFocused) {
            if (mode === 'HEX')
                setLocalVal(data.toString(16).toUpperCase().padStart(2, '0'));
            else if (mode === 'BIN')
                setLocalVal(data.toString(2).padStart(8, '0'));
            else if (mode === 'ASCII')
                setLocalVal(String.fromCharCode(data));
        }
    }, [data, mode, isFocused]);
    const handleChange = (val) => {
        setLocalVal(val);
        let num = data;
        if (mode === 'HEX') {
            const parsed = parseInt(val, 16);
            if (!isNaN(parsed))
                num = parsed & 0xFF;
        }
        else if (mode === 'BIN') {
            const parsed = parseInt(val, 2);
            if (!isNaN(parsed))
                num = parsed & 0xFF;
        }
        else if (mode === 'ASCII') {
            if (val.length > 0)
                num = val.charCodeAt(val.length - 1) & 0xFF;
        }
        if (num !== data)
            onUpdate(num);
    };
    const btnStyle = (m) => ({
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 9,
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 200ms',
        border: `1px solid ${mode === m ? theme.core.primary : theme.panel.border}`,
        background: mode === m ? `${theme.core.primary}20` : 'transparent',
        color: mode === m ? theme.core.primary : theme.core.muted,
    });
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 9, fontWeight: 'bold', color: theme.panel.label }, children: "MANUAL INJECTION" }), _jsx("div", { style: { display: 'flex', gap: 4 }, children: ['HEX', 'BIN', 'ASCII'].map(m => (_jsx("button", { style: btnStyle(m), onClick: () => setMode(m), children: m }, m))) })] }), _jsx(TextInput, { value: localVal, onChange: handleChange, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), width: "100%", placeholder: `Enter ${mode} value...` })] }));
};
export const DisplayPanel = () => {
    const { theme } = useTheme();
    const { hardware, view, busState, setBusState, pulseEN } = useLCD();
    const [lastLatched, setLastLatched] = React.useState(null);
    if (!view)
        return _jsx("div", { style: { color: theme.core.muted }, children: "Connecting\u2026" });
    const { data, rs, rw } = busState;
    const handlePulse = () => {
        pulseEN(data, rs, rw);
        setLastLatched(`0x${data.toString(16).toUpperCase()} → ${rs ? 'DDRAM' : 'CMD'}[0x${hardware?.addressPointer.toString(16).toUpperCase() || '??'}]`);
        setTimeout(() => setLastLatched(null), 2000);
    };
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            width: '100%',
        }, children: [_jsx(LcdDisplay, { view: view, blinkOn: hardware?.blinkOn ?? false, hardware: hardware || undefined }), _jsxs("div", { style: {
                    width: '100%',
                    maxWidth: '540px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    padding: '20px',
                    background: theme.core.surface,
                    borderRadius: 20,
                    border: `1px solid ${theme.panel.border}`,
                }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsx("div", { style: { fontSize: 10, fontWeight: 'bold', color: theme.panel.label, letterSpacing: '0.05em' }, children: "DATA BUS (8-BIT REGISTER)" }), _jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsx("div", { style: {
                                            flex: 1,
                                            height: 72,
                                            display: 'flex',
                                            background: theme.core.background,
                                            padding: '0 16px',
                                            borderRadius: 12,
                                            border: `1px solid ${theme.panel.border}`,
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: `inset 0 2px 10px ${theme.core.background}`
                                        }, children: [7, 6, 5, 4, 3, 2, 1, 0].map(bit => (_jsx(BusBit, { bit: bit, data: data, theme: theme, onToggle: (b) => setBusState({ data: data ^ (1 << b) }) }, bit))) }), _jsx(PulseButton, { label: "PULSE EN", onClick: handlePulse, style: { height: 72, padding: '0 24px', borderRadius: 12, minWidth: 120 } })] })] }), _jsxs("div", { style: {
                            display: 'flex',
                            gap: 20,
                            fontSize: 10,
                            fontWeight: 'bold',
                            color: theme.core.muted,
                            background: theme.core.background,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: `1px solid ${theme.panel.border}`
                        }, children: [_jsxs("span", { children: ["HEX: ", _jsxs("span", { style: { color: theme.core.primary }, children: ["0x", data.toString(16).toUpperCase().padStart(2, '0')] })] }), _jsxs("span", { children: ["BIN: ", _jsx("span", { style: { color: theme.core.primary }, children: data.toString(2).padStart(8, '0') })] }), _jsxs("span", { children: ["DEC: ", _jsx("span", { style: { color: theme.core.primary }, children: data })] })] }), _jsxs("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            borderTop: `1px solid ${theme.panel.border}`,
                            paddingTop: 16
                        }, children: [_jsx("div", { style: { fontSize: 10, fontWeight: 'bold', color: theme.panel.label, letterSpacing: '0.05em' }, children: "CONTROL SIGNALS" }), _jsx(GpioPanel, {}), _jsx(BusInput, { data: data, onUpdate: (val) => setBusState({ data: val }), theme: theme })] }), _jsx("div", { style: {
                            height: 12,
                            fontSize: 9,
                            fontFamily: theme.core.headingFont,
                            color: theme.core.primary,
                            opacity: lastLatched ? 1 : 0,
                            transition: 'opacity 200ms',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }, children: lastLatched ? `✓ ${lastLatched}` : '' })] })] }));
};
//# sourceMappingURL=DisplayPanel.js.map