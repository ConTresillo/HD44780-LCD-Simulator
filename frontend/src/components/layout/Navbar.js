import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Navbar.tsx — Top navigation bar.
 * Design from frontend_old: heading font, settings gear.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
import { SettingsModal } from './SettingsModal';
export const Navbar = () => {
    const { theme } = useTheme();
    const { hardware, connection } = useLCD();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const isBusy = hardware?.busyFlag ?? false;
    return (_jsxs(_Fragment, { children: [_jsxs("header", { style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 24px',
                    background: theme.navbar.background,
                    borderBottom: `1px solid ${theme.navbar.border}`,
                    boxShadow: theme.navbar.headingShadow,
                    boxSizing: 'border-box',
                }, children: [_jsx("div", { style: {
                            fontFamily: theme.core.headingFont,
                            fontSize: 14,
                            color: theme.navbar.heading,
                            letterSpacing: '0.15em',
                            userSelect: 'none',
                        }, children: "HD44780 LCD SIMULATOR" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("div", { style: {
                                    background: isBusy ? theme.statusBadge.busyBg : theme.statusBadge.readyBg,
                                    color: isBusy ? theme.statusBadge.busyText : theme.statusBadge.readyText,
                                    padding: '3px 12px', borderRadius: 99,
                                    fontSize: 10, fontFamily: theme.core.headingFont,
                                    letterSpacing: '0.1em',
                                }, children: isBusy ? '● BUSY' : '● READY' }), _jsx("div", { style: {
                                    background: theme.statusBadge[connection === 'connected' ? 'connectedBg' : 'disconnectedBg'],
                                    color: theme.statusBadge[connection === 'connected' ? 'connectedText' : 'disconnectedText'],
                                    padding: '3px 12px', borderRadius: 99,
                                    fontSize: 10, fontFamily: theme.core.headingFont,
                                    letterSpacing: '0.1em',
                                }, children: connection.toUpperCase() }), _jsx("button", { onClick: () => setSettingsOpen(true), "aria-label": "Open settings", style: {
                                    width: 30, height: 30, borderRadius: 6,
                                    border: `1px solid ${theme.menuDropdown.border}`,
                                    background: theme.menuDropdown.background,
                                    color: theme.menuDropdown.text,
                                    cursor: 'pointer', fontSize: 14,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 150ms',
                                }, children: "\u2699" })] })] }), _jsx(SettingsModal, { open: settingsOpen, onClose: () => setSettingsOpen(false) })] }));
};
//# sourceMappingURL=Navbar.js.map