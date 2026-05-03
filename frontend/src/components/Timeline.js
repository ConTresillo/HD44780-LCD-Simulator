import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Timeline = ({ traces }) => {
    return (_jsxs("div", { style: {
            backgroundColor: '#111',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            overflowX: 'auto',
            maxHeight: '400px'
        }, children: [_jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '80px 40px 40px 80px 80px 40px',
                    borderBottom: '1px solid #333',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.5rem',
                    color: '#94a3b8'
                }, children: [_jsx("div", { children: "Timestamp" }), _jsx("div", { children: "RS" }), _jsx("div", { children: "EN" }), _jsx("div", { children: "Bus (Hex)" }), _jsx("div", { children: "Assembled" }), _jsx("div", { children: "Exec" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column-reverse' }, children: traces.map((t, i) => (_jsxs("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: '80px 40px 40px 80px 80px 40px',
                        padding: '0.25rem 0',
                        borderBottom: '1px solid #222',
                        color: t.executed ? '#3b82f6' : '#eee'
                    }, children: [_jsxs("div", { style: { color: '#64748b' }, children: [new Date(t.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }), ".", t.timestamp % 1000] }), _jsx("div", { children: t.rs ? '1' : '0' }), _jsx("div", { style: { color: t.en ? '#ef4444' : '#22c55e' }, children: t.en ? 'H' : 'L' }), _jsxs("div", { children: [t.mode === '4bit' ? (t.data >> 4).toString(16).toUpperCase() : t.data.toString(16).toUpperCase().padStart(2, '0'), _jsxs("span", { style: { color: '#64748b', marginLeft: '4px' }, children: ["(", t.nibblePhase || '-', ")"] })] }), _jsx("div", { children: t.assembledByte !== null ? `0x${t.assembledByte.toString(16).toUpperCase().padStart(2, '0')}` : '-' }), _jsx("div", { style: { textAlign: 'center' }, children: t.executed ? '│' : '' })] }, i))) })] }));
};
//# sourceMappingURL=Timeline.js.map