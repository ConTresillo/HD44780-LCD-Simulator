import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SettingsModal.tsx — Theme switcher modal.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
export const SettingsModal = ({ open, onClose }) => {
    const { theme, setTheme, themes } = useTheme();
    if (!open)
        return null;
    return (_jsx("div", { onClick: onClose, style: {
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }, children: _jsxs("div", { onClick: e => e.stopPropagation(), style: {
                width: 320, background: theme.panel.background,
                border: `1px solid ${theme.panel.border}`,
                borderRadius: 12, padding: 24,
                boxShadow: theme.menuDropdown.shadow,
            }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, children: [_jsx("span", { style: { fontFamily: theme.core.headingFont, fontSize: 12, color: theme.navbar.heading, letterSpacing: '0.1em' }, children: "SETTINGS" }), _jsx("button", { onClick: onClose, style: {
                                background: 'transparent', border: `1px solid ${theme.menuDropdown.border}`,
                                color: theme.menuDropdown.text, borderRadius: 6,
                                padding: '4px 10px', cursor: 'pointer', fontSize: 14,
                            }, children: "\u00D7" })] }), _jsx("div", { style: { marginBottom: 8, fontSize: 10, color: theme.panel.label, fontFamily: theme.core.headingFont, letterSpacing: '0.08em' }, children: "THEME" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: themes.map(t => (_jsxs("button", { onClick: () => setTheme(t), style: {
                            width: '100%', padding: '10px 14px', borderRadius: 8,
                            border: `1px solid ${t === theme ? t.navbar.heading : t.panel.border}`,
                            background: t === theme ? t.core.surfaceAlt : t.core.surface,
                            color: t === theme ? t.navbar.heading : t.core.secondary,
                            fontFamily: t.core.bodyFont, fontSize: 12,
                            cursor: 'pointer', textAlign: 'left',
                            boxShadow: t === theme ? `0 0 8px ${t.navbar.heading}40` : 'none',
                            transition: 'all 150ms',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }, children: [_jsx("span", { style: {
                                    width: 12, height: 12, borderRadius: 3,
                                    background: t.lcd.pixelOn,
                                    boxShadow: `0 0 6px ${t.lcd.pixelOn}`,
                                    display: 'inline-block',
                                } }), t.name, t === theme && _jsx("span", { style: { marginLeft: 'auto', fontSize: 10, opacity: 0.7 }, children: "\u2713 ACTIVE" })] }, t.id))) })] }) }));
};
//# sourceMappingURL=SettingsModal.js.map