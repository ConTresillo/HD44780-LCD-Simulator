import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * LogPanel.tsx — Scrolling terminal-style log stream.
 */
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLogs } from '../../hooks/useLogs';
export const LogPanel = () => {
    const { theme } = useTheme();
    const logs = useLogs();
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs.length]);
    const colorFor = (type) => {
        switch (type) {
            case 'COMMAND': return theme.log.commandColor;
            case 'DATA': return theme.log.dataColor;
            case 'ERROR': return theme.log.errorColor;
            case 'CONTROL': return theme.log.controlColor;
        }
    };
    return (_jsxs("div", { style: {
            background: theme.log.background,
            display: 'flex', flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
        }, children: [_jsx("div", { style: {
                    fontSize: 10, color: theme.log.commandColor,
                    fontFamily: theme.core.headingFont,
                    letterSpacing: '0.1em', padding: '12px 16px 8px',
                    borderBottom: `1px solid ${theme.log.border}`,
                    marginBottom: 8,
                }, children: "SYSTEM LOG" }), _jsxs("div", { ref: scrollRef, style: { flex: 1, overflowY: 'auto', padding: '0 16px 12px' }, children: [logs.length === 0 && (_jsx("div", { style: { color: theme.core.muted, fontSize: 11, fontFamily: theme.core.bodyFont, paddingTop: 8 }, children: "Waiting for events\u2026" })), logs.map((entry, i) => {
                        const ts = new Date(entry.timestamp).toISOString().slice(11, 23);
                        return (_jsxs("div", { style: {
                                display: 'flex', gap: 10, alignItems: 'baseline',
                                marginBottom: 3,
                            }, children: [_jsx("span", { style: { color: theme.log.timestampColor, fontSize: 10, fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap' }, children: ts }), _jsxs("span", { style: {
                                        color: colorFor(entry.type), fontSize: 10,
                                        fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap',
                                        minWidth: 50,
                                    }, children: ["[", entry.type, "]"] }), _jsx("span", { style: { color: theme.core.secondary, fontSize: 11, fontFamily: theme.core.bodyFont }, children: entry.message })] }, i));
                    })] })] }));
};
//# sourceMappingURL=LogPanel.js.map