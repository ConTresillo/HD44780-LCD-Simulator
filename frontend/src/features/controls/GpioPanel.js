import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * GpioPanel.tsx — Hardware-level pin manipulation.
 * 8-bit Data Bus + RS, RW, EN control.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { DataPin, ToggleSwitch, PulseButton, IconButton } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';
export const GpioPanel = () => {
    const { theme } = useTheme();
    const { busState, setBusState } = useLCD();
    const { rs, rw, en } = busState;
    return (_jsxs("div", { style: {
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            padding: '0 10px'
        }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [_jsx(DataPin, { label: "RS", active: rs, onClick: () => setBusState({ rs: !rs }) }), _jsx("span", { style: { fontSize: 9, fontWeight: 'bold', color: theme.core.muted }, children: "REG SEL" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [_jsx(DataPin, { label: "RW", active: rw, onClick: () => setBusState({ rw: !rw }) }), _jsx("span", { style: { fontSize: 9, fontWeight: 'bold', color: theme.core.muted }, children: "RD/WR" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [_jsx(DataPin, { label: "EN", active: en, onClick: () => setBusState({ en: !en }) }), _jsx("span", { style: { fontSize: 9, fontWeight: 'bold', color: theme.core.muted }, children: "ENABLE" })] })] }));
};
//# sourceMappingURL=GpioPanel.js.map