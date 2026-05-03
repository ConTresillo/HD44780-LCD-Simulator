import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * UnifiedInputPanel.tsx — Single entry point for all LCD interactions.
 * Mode-driven: ASCII (Data), HEX (Command), BIN (GPIO).
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { TextInput, IconButton, MenuDropdown } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';
export const UnifiedInputPanel = () => {
    const [mode, setMode] = useState('ASCII');
    return (_jsxs("div", { style: {
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 12,
            padding: '16px',
            color: '#fff'
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 'bold' }, children: "MANUAL INJECTION" }), _jsx("div", { style: { display: 'flex', gap: 4 }, children: ['ASCII', 'HEX', 'BIN'].map(m => (_jsx("button", { onClick: () => setMode(m), style: {
                                background: mode === m ? '#444' : '#222',
                                color: '#fff',
                                border: '1px solid #555',
                                padding: '4px 8px',
                                fontSize: 10,
                                cursor: 'pointer'
                            }, children: m }, m))) })] }), _jsx("input", { type: "text", readOnly: true, value: `MODE: ${mode}`, style: {
                    width: '100%',
                    background: '#000',
                    color: '#0f0',
                    border: '1px solid #333',
                    padding: '8px',
                    fontFamily: 'monospace'
                } })] }));
};
//# sourceMappingURL=UnifiedInputPanel.js.map